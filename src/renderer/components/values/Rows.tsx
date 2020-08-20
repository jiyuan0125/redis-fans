import React from 'react';
import {
  Button,
  TableContainer,
  InputAdornment,
  OutlinedInput,
  FormControl,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import { SearchIcon } from '@src/icons/SearchIcon';
import { CloseIcon } from '@src/icons/CloseIcon';
import { AppResizer } from '../AppResizer';
import {
  DIMENSION_ROWS_WIDTH_MAXSIZE,
  DIMENSION_ROWS_WIDTH_MINSIZE,
} from '@src/constants';
import { Settings } from '@src/types';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import clsx from 'clsx';
import electron from 'electron';
const { Menu, MenuItem } = electron.remote;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rowsRoot: {
      position: 'relative',
      display: 'flex',
      flexFlow: 'column',
      flex: 1,
    },
    rowsContainer: {
      display: 'flex',
      flexFlow: 'column',
      height: 0,
      flexGrow: 1,
      '& .MuiTableBody-root .MuiTableCell-root': {
        padding: `0 ${theme.spacing(1)}px`,
      },
    },
    rowsContainerInner: {
      flex: 1,
    },
    rowsHeader: {
      height: 30,
      fontWeight: 'bold',
      backgroundColor: theme.palette.grey[50],
      display: 'flex',
    },
    rowsContent: {
      flex: 1,
    },
    rowsFooter: {
      height: 30,
      boxSizing: 'border-box',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.grey[50],
      fontWeight: 'bold',
    },
    rowsColumn: {
      padding: theme.spacing(1),
      width: 0,
    },
    row: {
      cursor: 'pointer',
      paddingLeft: 0,
      paddingRight: 0,
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
    rowsItemWrapper: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    rowsItem: {
      display: 'flex',
      alignItems: 'center',
    },
    rowsText: {
      flex: 1,
    },
    selected: {
      backgroundColor: '#eeeeee',
    },
  })
);

export type ColumnAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';

export interface Columns {
  label: string;
  key: string;
  flex: number;
  align: ColumnAlign;
}

export interface RowsProps {
  onAddRow: () => void;
  onDeleteRow: (selected: number) => void;
  onSelect: (selected: number) => void;
  primaryKey: string;
  rows: Record<string, any>[] | string[];
  columns: Columns[];
  selected: string | number;
  size: number;
  onSizeChange: (size: number) => void;
  appSettings: Settings;
  total: number;
}

export const Rows = React.memo((props: RowsProps) => {
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [deleteRowDialogVisible, setDeleteRowDialogVisible] = React.useState(
    false
  );

  const {
    columns,
    rows,
    primaryKey: keyProp,
    onAddRow,
    onDeleteRow,
    onSelect,
    selected,
    size,
    onSizeChange,
    appSettings,
    total,
  } = props;
  const classes = useStyles(appSettings);

  const handleCopyRow = React.useCallback(
    (_ev: React.MouseEvent, selected: number) => {
      const listener = (ev: ClipboardEvent) => {
        ev.preventDefault();
        if (ev.clipboardData && selected !== -1) {
          ev.clipboardData.setData('text/plain', rows[selected][keyProp]);
        }
      };

      document.addEventListener('copy', listener);
      document.execCommand('copy');
      document.removeEventListener('copy', listener);
    },
    [rows]
  );

  const handleDeleteRow = React.useCallback(
    (ev: React.MouseEvent, selected: number) => {
      ev.stopPropagation();
      onSelect(selected);
      setDeleteRowDialogVisible(true);
    },
    [onSelect, setDeleteRowDialogVisible]
  );

  const handleSearchInput = React.useCallback(
    (ev: React.ChangeEvent<{ value: string }>) => {
      setSearchKeyword(ev.target.value);
    },
    [setSearchKeyword]
  );

  const handleSearchClean = React.useCallback(() => {
    setSearchKeyword('');
  }, [setSearchKeyword]);

  const handleDeleteRowCancel = React.useCallback(() => {
    setDeleteRowDialogVisible(false);
  }, [setDeleteRowDialogVisible]);

  const handleDeleteRowCommit = React.useCallback(() => {
    if (typeof selected === 'number' && selected !== -1) {
      onDeleteRow(selected);
    }
    handleDeleteRowCancel();
  }, [selected, onDeleteRow, handleDeleteRowCancel]);

  const handleSelected = React.useCallback(
    (selected: number) => {
      onSelect(selected);
    },
    [onSelect]
  );

  React.useEffect(
    _.debounce(() => {
      setFilteredRows(
        (rows as Record<string, any>[]).filter((r) => {
          return columns.some((c) => {
            return (
              r[c.key]
                .toLowerCase()
                .indexOf(searchKeyword.toLocaleLowerCase()) > -1
            );
          });
        })
      );
    }, 500),
    [rows, columns, searchKeyword]
  );

  const [filteredRows, setFilteredRows] = React.useState<
    Record<string, any>[] | string[]
  >([]);

  const handleAddRow = React.useCallback(() => {
    onAddRow();
  }, [onAddRow]);

  const showMenu = React.useCallback(
    (selected: number) => (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onSelect(selected);
      const menu = new Menu();
      menu.append(
        new MenuItem({
          id: 'copy',
          label: 'Copy Row',
          click() {
            handleCopyRow(ev, selected);
          },
        })
      );
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(
        new MenuItem({
          id: 'delete',
          label: 'Delete Row',
          click() {
            handleDeleteRow(ev, selected);
          },
        })
      );
      menu.popup({ window: electron.remote.getCurrentWindow() });
    },
    []
  );

  return (
    <div className={classes.rowsRoot}>
      <div className={classes.tableOperator}>
        <FormControl className={classes.inputSearch} variant="outlined">
          <OutlinedInput
            spellCheck={false}
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
      <TableContainer component={Paper} className={classes.rowsContainer}>
        <div className={classes.rowsHeader}>
          {columns.map((c) => {
            return (
              <div
                className={classes.rowsColumn}
                style={{ flex: c.flex, textAlign: c.align }}
                key={c.key}
              >
                {c.label}
              </div>
            );
          })}
        </div>
        <div className={classes.rowsContent}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                width={width}
                height={height}
                itemSize={35}
                itemData={filteredRows}
                itemCount={filteredRows.length}
              >
                {({ style, index, data }) => {
                  const row = data[index];
                  return (
                    <ListItem
                      button
                      style={style}
                      onClick={() => handleSelected(index)}
                      onContextMenu={showMenu(index)}
                      key={index}
                      className={clsx(classes.row, {
                        [classes.selected]: selected === index,
                      })}
                    >
                      {columns.map((c) => {
                        return (
                          <ListItemText
                            className={classes.rowsItemWrapper}
                            style={{ flex: c.flex, textAlign: c.align }}
                            key={c.key}
                            primary={
                              <div className={classes.rowsItem}>
                                <div
                                  className={clsx(
                                    classes.rowsText,
                                    classes.cell
                                  )}
                                >
                                  {row[c.key]}
                                </div>
                              </div>
                            }
                          />
                        );
                      })}
                    </ListItem>
                  );
                }}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
        <div className={classes.rowsFooter}>
          Rows: {filteredRows.length} / {total}
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
