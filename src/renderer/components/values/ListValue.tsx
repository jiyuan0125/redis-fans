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
import { resetFormData } from '@src/utils/common';
import { Rows, ColumnAlign } from './Rows';
import { Value } from './Value';
import { DIMENSION_ROWS_WIDTH_MAXSIZE } from '@src/constants';

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
  object: DataObject<'list'>;
  addListValue: (object: DataObject, value: string) => void;
  updateListValue: (object: DataObject, index: number, value: string) => void;
  deleteListValue: (object: DataObject, index: number) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
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
  } = props;
  const classes = useStyles();
  const [selected, setSelected] = React.useState<number>(-1);
  const [addRowDialogVisible, setAddRowDialogVisible] = React.useState(false);
  const [formData, updateFormData] = useImmer(initialFormData);
  const [value, setValue] = React.useState('');
  const [rowsSize, setRowsSize] = React.useState<number>(
    DIMENSION_ROWS_WIDTH_MAXSIZE
  );

  const data = (object.value || []) as string[];

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
    addListValue(object, formData.value);
    updateFormData((draft) => {
      resetFormData(draft, initialFormData);
    });
    handleAddRowCancel();
  };

  const handleDeleteRow = (selected: string | number) => {
    if (typeof selected === 'number') {
      deleteListValue(object, selected);
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
      updateListValue(props.object, selected, value);
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
    <div className={classes.listValueRoot}>
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
