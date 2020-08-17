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
import { DataObject, Settings, MessageType } from '@src/types';
import { useImmer } from 'use-immer';
import { resetFormData, convertHashToArray } from '@src/utils/common';
import _ from 'lodash';
import { Rows, ColumnAlign } from './Rows';
import { Value } from './Value';
import { DIMENSION_ROWS_WIDTH_MAXSIZE } from '@src/constants';

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
  object: DataObject<'hash'>;
  addHashField: (object: DataObject, field: string, value: string) => void;
  updateHashField: (
    object: DataObject,
    oldField: string,
    newField: string,
    value: string
  ) => void;
  updateHashValue: (object: DataObject, field: string, value: string) => void;
  deleteHashField: (object: DataObject, field: string) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
}

export const HashValue = React.memo((props: HashValueProp) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<string>('');
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
  } = props;

  const data = convertHashToArray(object.value).sort((a, b) => {
    return a.key.localeCompare(b.key);
  }) as Record<string, any>[];

  const [value, setValue] = React.useState('');
  const [field, setField] = React.useState('');
  React.useEffect(() => {
    setField(selected || '');
    setValue(object.value![selected] || '');
  }, [selected, object.value, refreshIndicator]);

  const handleFieldChange = (field: string) => {
    setField(field);
  };

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  const handleAddRow = () => {
    setAddRowDialogVisible(true);
  };

  const handleAddRowCancel = () => {
    setAddRowDialogVisible(false);
  };

  const handleAddRowCommit = () => {
    if (!formData.field) {
      showMessage('error', 'Hash field should not be empty.');
      return;
    }
    addHashField(object, formData.field, formData.value);
    updateFormData((draft) => {
      resetFormData(draft, initialFormData);
    });
    handleAddRowCancel();
  };

  const handleDeleteRow = (selected: string | number) => {
    if (typeof selected === 'string') {
      deleteHashField(object, selected);
      setSelected('');
    }
  };

  const handleChange = (
    ev: React.ChangeEvent<{ value: string }>,
    field: string
  ) => {
    ev.persist();
    updateFormData((draft) => {
      draft[field] = ev.target.value;
    });
  };

  const handleUpdateField = () => {
    if (selected) {
      if (!field) {
        showMessage('error', 'Hash field should not be empty.');
        return;
      }
      updateHashField(props.object, selected, field, value);
    }
  };

  const handleUpdateValue = () => {
    if (selected) {
      updateHashValue(props.object, selected, value);
    }
  };

  const handleSelectRow = (selected: string | number) => {
    if (typeof selected === 'string') {
      setSelected(selected);
    }
  };

  const columns = [
    {
      label: 'FIELDS',
      key: 'key',
      width: 150,
      align: 'left' as ColumnAlign,
    },
    {
      label: 'VALUES',
      key: 'value',
      width: 150,
      align: 'left' as ColumnAlign,
    },
  ];

  return (
    <div className={classes.hashValueRoot}>
      <div className={classes.left} style={{ width: rowsSize }}>
        <Rows
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onSelect={handleSelectRow}
          primaryKey="key"
          isList={false}
          data={data}
          selected={selected}
          columns={columns}
          size={rowsSize}
          onSizeChange={setRowsSize}
          appSettings={appSettings}
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
