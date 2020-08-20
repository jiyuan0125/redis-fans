import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import {
  Settings,
  MessageType,
  ListDataObject,
  ListValueType,
} from '@src/types';
import { useImmer } from 'use-immer';
import { resetFormData } from '@src/utils/common';
import { Rows, ColumnAlign } from './Rows';
import { Value } from './Value';
import { DIMENSION_ROWS_WIDTH_MAXSIZE } from '@src/constants';
import { Ranger } from './Ranger';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listValueRoot: {
      display: 'flex',
      flex: 1,
    },
    left: {
      height: '100%',
      marginRight: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
    },
    tableKey: {
      flexGrow: 1,
    },
    row: {
      cursor: 'pointer',
    },
    right: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    inputKey: {},
    inputValue: {
      flexGrow: 1,
      '& .MuiInputBase-root': {
        height: '100%',
        alignItems: 'stretch',
      },
    },
    addRowDialogContent: {
      width: 600,
    },
  })
);

const initialFormData = {
  value: '',
};

interface ListValueProp {
  object: ListDataObject;
  addListValue: (object: ListDataObject, value: string) => void;
  updateListValue: (
    object: ListDataObject,
    index: number,
    value: string
  ) => void;
  deleteListValue: (object: ListDataObject, index: number) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
  fetchListValues: (
    object: ListDataObject,
    start: number,
    stop: number
  ) => void;
}

export const ListValue = React.memo((props: ListValueProp) => {
  const {
    addListValue,
    updateListValue,
    deleteListValue,
    object,
    appSettings,
    refreshIndicator,
    showMessage,
    fetchListValues,
  } = props;
  const classes = useStyles();
  const [selected, setSelected] = React.useState<number>(-1);
  const [addRowDialogVisible, setAddRowDialogVisible] = React.useState(false);
  const [formData, updateFormData] = useImmer(initialFormData);
  const [value, setValue] = React.useState('');
  const [rowsSize, setRowsSize] = React.useState<number>(
    DIMENSION_ROWS_WIDTH_MAXSIZE
  );

  const data = React.useMemo(() => object.values || ([] as ListValueType[]), [
    object.values,
  ]);

  React.useEffect(() => {
    if (selected !== -1) {
      setValue(data[selected]?.value);
    }
  }, [selected]);

  const handleAddRow = React.useCallback(() => {
    setAddRowDialogVisible(true);
  }, [setAddRowDialogVisible]);

  const handleAddRowCancel = React.useCallback(() => {
    setAddRowDialogVisible(false);
  }, [setAddRowDialogVisible]);

  const handleAddRowCommit = React.useCallback(() => {
    addListValue(object, formData.value);
    updateFormData((draft) => {
      resetFormData(draft, initialFormData);
    });
    handleAddRowCancel();
  }, [
    addListValue,
    object,
    formData,
    updateFormData,
    resetFormData,
    initialFormData,
    handleAddRowCancel,
  ]);

  const handleDeleteRow = React.useCallback(
    (selected: number) => {
      deleteListValue(object, selected);
    },
    [deleteListValue, object]
  );

  const handleSelectRow = React.useCallback(
    (selected: number) => {
      setSelected(selected);
    },
    [setSelected, selected]
  );

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<{ value: string }>, key: string) => {
      ev.persist();
      updateFormData((draft) => {
        draft[key] = ev.target.value;
      });
    },
    [updateFormData]
  );

  const handleValueChange = React.useCallback(
    (value: string) => {
      setValue(value);
    },
    [setValue]
  );

  const handleSaveValue = React.useCallback(() => {
    if (selected !== -1) {
      updateListValue(object, selected, value);
    }
  }, [selected, updateListValue, object, value]);

  const columns = [
    {
      key: 'value',
      label: 'VALUES',
      flex: 1,
      align: 'left' as ColumnAlign,
    },
  ];

  return (
    <div className={classes.listValueRoot}>
      <div className={classes.left} style={{ width: rowsSize }}>
        <Ranger<ListDataObject>
          object={object}
          onFetchValues={fetchListValues}
        />
        <Rows
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onSelect={handleSelectRow}
          primaryKey="value"
          rows={data}
          selected={selected}
          columns={columns}
          size={rowsSize}
          onSizeChange={setRowsSize}
          appSettings={appSettings}
          total={object.total}
        />
      </div>
      <div className={classes.right}>
        <Value
          label="Value"
          value={value}
          onValueChange={handleValueChange}
          onSaveValue={handleSaveValue}
          appSettings={appSettings}
          showMessage={showMessage}
        />
      </div>
      <Dialog open={addRowDialogVisible} onClose={handleAddRowCancel}>
        <DialogTitle>Add Row</DialogTitle>
        <DialogContent className={classes.addRowDialogContent}>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Value"
            variant="outlined"
            value={formData.value}
            onChange={(ev) => handleChange(ev, 'value')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddRowCancel}>Cancel</Button>
          <Button onClick={handleAddRowCommit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
