import React from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  OutlinedInput,
  FormControl,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DeleteIcon } from '@src/icons/DeleteIcon';
import _ from 'lodash';
import { SearchIcon } from '@src/icons/SearchIcon';
import { CloseIcon } from '@src/icons/CloseIcon';
import { AppResizer } from '../AppResizer';
import {
  DIMENSION_ROWS_WIDTH_MAXSIZE,
  DIMENSION_ROWS_WIDTH_MINSIZE,
} from '@src/constants';
import { Settings } from '@src/types';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rowsRoot: {
      position: 'relative',
      display: 'flex',
      flexFlow: 'column',
      flex: 1,
    },
    tableContainer: {
      display: 'flex',
      flexFlow: 'column',
      height: 0,
      flexGrow: 1,
      '& .MuiTableBody-root .MuiTableCell-root': {
        padding: `0 ${theme.spacing(1)}px`,
      },
    },
    tableContainerInner: {
      flex: 1,
    },
    rowCount: {
      height: 30,
      boxSizing: 'border-box',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.grey[50],
      fontWeight: 'bold',
    },
    row: {
      cursor: 'pointer',
    },
    cell: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontFamily: (props: Settings) => props.uiFont,
      fontSize: (props: Settings) => `${props.uiFontSize}px`,
    },
    btnDelete: {
      color: theme.palette.error.main,
    },
    tableOperator: {
      display: 'flex',
      alignItems: 'center',
    },
    inputSearch: {
      flexGrow: 1,
      marginRight: theme.spacing(1),
    },
    btnClean: {
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: theme.typography.fontSize,
      },
    },
  })
);

export type ColumnAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';

export interface Columns {
  label: string;
  key?: string;
  width: number;
  align: ColumnAlign;
}

export interface RowsProps {
  onAddRow: () => void;
  onDeleteRow: (selected: string | number) => void;
  onSelect: (selected: string | number) => void;
  primaryKey: string;
  isList: boolean;
  data: Record<string, any>[] | string[];
  columns: Columns[];
  selected: string | number;
  size: number;
  onSizeChange: (size: number) => void;
  appSettings: Settings;
}

export const Rows = React.memo((props: RowsProps) => {
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [deleteRowDialogVisible, setDeleteRowDialogVisible] = React.useState(
    false
  );

  const {
    columns,
    data,
    primaryKey: keyProp,
    isList,
    onAddRow,
    onDeleteRow,
    onSelect,
    selected,
    size,
    onSizeChange,
    appSettings,
  } = props;
  const classes = useStyles(appSettings);

  const handleDeleteRow = (ev: React.MouseEvent, selected: string | number) => {
    ev.stopPropagation();
    onSelect(selected);
    setDeleteRowDialogVisible(true);
  };

  const handleSearchInput = (ev: React.ChangeEvent<{ value: string }>) => {
    setSearchKeyword(ev.target.value);
  };

  const handleSearchClean = () => {
    setSearchKeyword('');
  };

  const handleDeleteRowCancel = () => {
    setDeleteRowDialogVisible(false);
  };

  const handleDeleteRowCommit = () => {
    if (
      (typeof selected === 'string' && selected) ||
      (typeof selected === 'number' && selected !== -1)
    ) {
      onDeleteRow(selected);
    }
    handleDeleteRowCancel();
  };

  const handleSelected = (selected: string | number) => {
    onSelect(selected);
  };

  const dataIsRecordArray = (
    data: Record<string, any>[] | string[]
  ): data is Record<string, any>[] => {
    if (data && data.length > 0 && typeof data[0] !== 'string') {
      return true;
    }
    return false;
  };

  const isRecordArray = dataIsRecordArray(data);

  const getFilteredRecordRows = () => {
    return (data as Record<string, any>[]).filter(
      (r) =>
        r[keyProp].toLowerCase().indexOf(searchKeyword.toLocaleLowerCase()) > -1
    );
  };

  const getFilteredStringRows = () => {
    return (data as string[]).filter(
      (r) => r.toLowerCase().indexOf(searchKeyword.toLocaleLowerCase()) > -1
    );
  };

  const handleAddRow = () => {
    onAddRow();
  };

  return (
    <div className={classes.rowsRoot}>
      <div className={classes.tableOperator}>
        <FormControl className={classes.inputSearch} variant="outlined">
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            endAdornment={
              searchKeyword && (
                <InputAdornment
                  className={classes.btnClean}
                  position="start"
                  onClick={handleSearchClean}
                >
                  <CloseIcon />
                </InputAdornment>
              )
            }
            placeholder="Filter"
            value={searchKeyword}
            onChange={handleSearchInput}
          />
        </FormControl>
        <Button variant="contained" onClick={handleAddRow}>
          Add Row
        </Button>
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <div className={classes.tableContainerInner}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((c, index) => (
                  <TableCell
                    key={index}
                    align={c.align}
                    style={{ width: c.width, maxWidth: c.width }}
                  >
                    {c.label}
                  </TableCell>
                ))}
                <TableCell style={{ width: 100 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                isRecordArray &&
                getFilteredRecordRows().map((r, index) => {
                  const indexValue = isList ? index : r[keyProp];
                  return (
                    <TableRow
                      key={index}
                      selected={selected === indexValue}
                      onClick={() => handleSelected(indexValue)}
                      className={classes.row}
                    >
                      {columns.map((c, index) => (
                        <TableCell
                          key={index}
                          component="th"
                          scope="row"
                          className={classes.cell}
                          align={c.align}
                          style={{
                            width: c.width,
                            maxWidth: c.width,
                          }}
                        >
                          {r[c.key!]}
                        </TableCell>
                      ))}
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        style={{ width: 100 }}
                      >
                        <IconButton
                          className={classes.btnDelete}
                          onClick={(e) => handleDeleteRow(e, indexValue)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {data &&
                !isRecordArray &&
                getFilteredStringRows().map((r, index) => {
                  return (
                    <TableRow
                      key={index}
                      selected={selected === index}
                      onClick={() => handleSelected(index)}
                      className={classes.row}
                    >
                      {columns.map((c, index) => (
                        <TableCell
                          key={index}
                          component="th"
                          scope="row"
                          className={classes.cell}
                          align={c.align}
                          style={{
                            width: c.width,
                            maxWidth: c.width,
                          }}
                        >
                          {r}
                        </TableCell>
                      ))}
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        style={{ width: 100 }}
                      >
                        <IconButton
                          className={classes.btnDelete}
                          onClick={(e) => handleDeleteRow(e, index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <div className={classes.rowCount}>
          Rows:{' '}
          {isRecordArray
            ? getFilteredRecordRows().length
            : getFilteredStringRows().length}
        </div>
      </TableContainer>
      <Dialog open={deleteRowDialogVisible} onClose={handleDeleteRowCancel}>
        <DialogTitle>Delete Row</DialogTitle>
        <DialogContent>Do you really want to remove this row?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteRowCancel}>Cancel</Button>
          <Button onClick={handleDeleteRowCommit}>Delete</Button>
        </DialogActions>
      </Dialog>
      <AppResizer
        size={size}
        onSizeChange={(size) => onSizeChange(size)}
        position="right"
        maxSize={DIMENSION_ROWS_WIDTH_MAXSIZE}
        minSize={DIMENSION_ROWS_WIDTH_MINSIZE}
      />
    </div>
  );
});
