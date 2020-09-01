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
  HashDataObject,
  HashValueType,
} from '@src/types';
import { useImmer } from 'use-immer';
import { resetFormData } from '@src/utils/common';
import _ from 'lodash';
import { Rows, ColumnAlign } from './Rows';
import { Value } from './Value';
import { DIMENSION_ROWS_WIDTH_MAXSIZE } from '@src/constants';
import { Scanner } from './Scaner';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hashValueRoot: {
      display: 'flex',
      height: '100%',
    },
    left: {
      height: '100%',
      marginRight: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
    },
    tableContainerKey: {
      height: 200,
      flexGrow: 1,
      '& .MuiTableBody-root .MuiTableCell-root': {
        padding: `0 ${theme.spacing(1)}px`,
      },
    },
    row: {
      cursor: 'pointer',
    },
    right: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    hashValueKeyRoot: {},
    hashValueValueRoot: {
      height: 200,
      flexGrow: 1,
    },
    inputField: {},
    inputValue: {
      flexGrow: 1,
      '& .MuiInputBase-root': {
        height: '100%',
        alignItems: 'stretch',
      },
    },
    tableOperator: {
      display: 'flex',
      alignItems: 'center',
    },
    inputSearch: {
      flexGrow: 1,
      marginRight: theme.spacing(1),
    },
    viewAsControl: {
      minWidth: 120,
    },
    btnClean: {
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: theme.typography.fontSize,
      },
    },
    hashValueKeyHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    hashValueKeyContent: {},
    hashValueValueHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    hashValueValueContent: {
      flexGrow: 1,
    },
    addRowContent: {
      width: 600,
    },
  })
);

const initialFormData = {
  field: '',
  value: '',
};

interface HashValueProp {
  object: HashDataObject;
  addHashField: (object: HashDataObject, field: string, value: string) => void;
  updateHashField: (
    object: HashDataObject,
    oldField: string,
    newField: string,
    value: string
  ) => void;
  updateHashValue: (
    object: HashDataObject,
    field: string,
    value: string
  ) => void;
  deleteHashField: (object: HashDataObject, field: string) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
  fetchHashValues: (
    object: HashDataObject,
    cursor: number,
    match: string,
    count: number
  ) => void;
}

export const HashValue = React.memo((props: HashValueProp) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<number>(-1);
  const [addRowDialogVisible, setAddRowDialogVisible] = React.useState(false);
  const [formData, updateFormData] = useImmer(initialFormData);
  const [rowsSize, setRowsSize] = React.useState<number>(
    DIMENSION_ROWS_WIDTH_MAXSIZE
  );
  const {
    addHashField,
    updateHashField,
    updateHashValue,
    deleteHashField,
    object,
    appSettings,
    refreshIndicator,
    showMessage,
    fetchHashValues,
  } = props;

  const data = React.useMemo(
    () =>
      object.values.slice().sort((a, b) => {
        return a.field.localeCompare(b.field);
      }) as HashValueType[],
    [object.values]
  );

  const [value, setValue] = React.useState('');
  const [field, setField] = React.useState('');
  React.useEffect(() => {
    setField(data[selected]?.field || '');
    setValue(data[selected]?.value || '');
  }, [selected, object.values, refreshIndicator]);

  const handleFieldChange = React.useCallback(
    (field: string) => {
      setField(field);
    },
    [setField, field]
  );

  const handleValueChange = React.useCallback(
    (value: string) => {
      setValue(value);
    },
    [setValue, value]
  );

  const handleAddRow = React.useCallback(() => {
    setAddRowDialogVisible(true);
  }, [setAddRowDialogVisible]);

  const handleAddRowCancel = React.useCallback(() => {
    setAddRowDialogVisible(false);
  }, [setAddRowDialogVisible]);

  const handleAddRowCommit = React.useCallback(() => {
    if (!formData.field) {
      showMessage('error', 'Hash field should not be empty.');
      return;
    }
    const index = object.values.findIndex((v) => v.field === formData.field);
    if (index !== -1) {
      showMessage('error', 'An row with the same field already exists.');
      return;
    }
    addHashField(object, formData.field, formData.value);
    updateFormData((draft) => {
      resetFormData(draft, initialFormData);
    });
    handleAddRowCancel();
  }, [
    object,
    formData,
    showMessage,
    addHashField,
    updateFormData,
    resetFormData,
    initialFormData,
    handleAddRowCancel,
  ]);

  const handleDeleteRow = React.useCallback(
    (selected: number) => {
      deleteHashField(object, data[selected].field);
    },
    [deleteHashField, object, data]
  );

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<{ value: string }>, field: string) => {
      ev.persist();
      updateFormData((draft) => {
        draft[field] = ev.target.value;
      });
    },
    [updateFormData]
  );

  const handleUpdateField = React.useCallback(() => {
    if (selected !== -1) {
      if (!field) {
        showMessage('error', 'Hash field should not be empty.');
        return;
      }
      updateHashField(object, data[selected].field, field, value);
    }
  }, [selected, showMessage, field, updateHashField, object, data, value]);

  const handleUpdateValue = React.useCallback(() => {
    if (selected !== -1) {
      updateHashValue(object, data[selected].field, value);
    }
  }, [selected, updateHashField, object, data, value]);

  const handleSelectRow = React.useCallback(
    (selected: number) => {
      setSelected(selected);
    },
    [setSelected, selected]
  );

  const columns = [
    {
      label: 'FIELDS',
      key: 'field',
      flex: 1,
      align: 'left' as ColumnAlign,
    },
    {
      label: 'VALUES',
      key: 'value',
      flex: 1,
      align: 'left' as ColumnAlign,
    },
  ];

  return (
    <div className={classes.hashValueRoot}>
      <div className={classes.left} style={{ width: rowsSize }}>
        <Scanner<HashDataObject>
          object={object}
          onFatchValues={fetchHashValues}
          scanBtnLabel="hscan"
        />
        <Rows
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onSelect={handleSelectRow}
          primaryKey="field"
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
        <div className={classes.hashValueKeyRoot}>
          <Value
            label="Field"
            value={field}
            appSettings={appSettings}
            onValueChange={handleFieldChange}
            showMessage={showMessage}
            onSaveValue={handleUpdateField}
          />
        </div>
        <div className={classes.hashValueValueRoot}>
          <Value
            label="Value"
            value={value}
            onValueChange={handleValueChange}
            onSaveValue={handleUpdateValue}
            appSettings={appSettings}
            showMessage={showMessage}
          />
        </div>
      </div>
      <Dialog open={addRowDialogVisible} onClose={handleAddRowCancel}>
        <DialogTitle>Add Row</DialogTitle>
        <DialogContent className={classes.addRowContent}>
          <TextField
            spellCheck={false}
            fullWidth
            multiline
            rows={5}
            label="Field"
            variant="outlined"
            value={formData.field}
            onChange={(ev) => handleChange(ev, 'field')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            spellCheck={false}
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
