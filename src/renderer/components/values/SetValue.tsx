import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DataObject, Settings, MessageType } from '@src/types';
import { resetFormData } from '@src/utils/common';
import React from 'react';
import { useImmer } from 'use-immer';
import _ from 'lodash';
import { Rows, ColumnAlign } from './Rows';
import { Value } from './Value';
import { DIMENSION_ROWS_WIDTH_MAXSIZE } from '@src/constants';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    setValueRoot: {
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
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
    },
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
    setValueHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    setValueContent: {
      flexGrow: 1,
    },
    addRowDialogContent: {
      width: 600,
    },
  })
);

const initialFormData = {
  value: '',
};

interface SetValueProp {
  object: DataObject<'set'>;
  addSetValue: (object: DataObject, value: string) => void;
  updateSetValue: (
    object: DataObject,
    oldValue: string,
    newValue: string
  ) => void;
  deleteSetValue: (object: DataObject, value: string) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
}

export const SetValue = React.memo((props: SetValueProp) => {
  const {
    addSetValue,
    updateSetValue,
    deleteSetValue,
    object,
    appSettings,
    refreshIndicator,
    showMessage,
  } = props;
  const [selected, setSelected] = React.useState<number>(-1);
  const classes = useStyles();
  const [addRowDialogVisible, setAddRowDialogVisible] = React.useState(false);
  const [formData, updateFormData] = useImmer(initialFormData);
  const [rowsSize, setRowsSize] = React.useState<number>(
    DIMENSION_ROWS_WIDTH_MAXSIZE
  );
  const [value, setValue] = React.useState('');

  const data = (object.value || []).slice().sort((a, b) => {
    return a.localeCompare(b);
  }) as string[];

  React.useEffect(() => {
    if (typeof selected === 'number') {
      if (selected > -1) {
        setValue(data[selected]);
      }
    }
  }, [selected, data, refreshIndicator]);

  const handleAddRow = () => {
    setAddRowDialogVisible(true);
  };

  const handleAddRowCancel = () => {
    setAddRowDialogVisible(false);
  };

  const handleAddRowCommit = () => {
    addSetValue(object, formData.value);
    updateFormData((draft) => {
      resetFormData(draft, initialFormData);
    });
    handleAddRowCancel();
  };

  const handleDeleteRow = (selected: string | number) => {
    if (typeof selected === 'number') {
      deleteSetValue(object, data[selected]);
    }
  };

  const handleSelectRow = (selected: string | number) => {
    if (typeof selected === 'number') {
      setSelected(selected);
    }
  };

  const handleChange = (
    ev: React.ChangeEvent<{ value: string }>,
    key: string
  ) => {
    ev.persist();
    updateFormData((draft) => {
      draft[key] = ev.target.value;
    });
  };

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  const handleSaveValue = () => {
    if (selected > -1) {
      updateSetValue(props.object, data[selected], value);
    }
  };

  const columns = [
    {
      label: 'VALUES',
      width: 300,
      align: 'left' as ColumnAlign,
    },
  ];

  return (
    <div className={classes.setValueRoot}>
      <div className={classes.left} style={{ width: rowsSize }}>
        <Rows
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onSelect={handleSelectRow}
          primaryKey="value"
          isList
          data={data}
          selected={selected}
          columns={columns}
          size={rowsSize}
          onSizeChange={setRowsSize}
          appSettings={appSettings}
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
