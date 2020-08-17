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
import { useGlobal } from '@src/hooks/useGlobal';
import { Rows, ColumnAlign } from './Rows';
import { Value } from './Value';
import { DIMENSION_ROWS_WIDTH_MAXSIZE } from '@src/constants';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    zsetValueRoot: {
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
    inputScore: {},
    scoreRoot: {
      display: 'flex',
      flexDirection: 'column',
    },
    valueRoot: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    addRowDialogContent: {
      width: 600,
    },
  })
);

const initialFormData = {
  score: '0',
  value: '',
};

interface ValueType {
  value: string;
  score: string;
}

interface ZsetValueProp {
  object: DataObject<'zset'>;
  addZsetValue: (object: DataObject, score: number, value: string) => void;
  updateZsetValue: (
    object: DataObject,
    oldValue: string,
    score: number,
    newValue: string
  ) => void;
  deleteZsetValue: (object: DataObject, value: string) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
}

export const ZsetValue = React.memo((props: ZsetValueProp) => {
  const { showMessage } = useGlobal();
  const {
    addZsetValue,
    updateZsetValue,
    deleteZsetValue,
    object,
    appSettings,
    refreshIndicator,
  } = props;
  const classes = useStyles();
  const [values, setValues] = React.useState([] as ValueType[]);
  const [rowsSize, setRowsSize] = React.useState<number>(
    DIMENSION_ROWS_WIDTH_MAXSIZE
  );

  React.useEffect(() => {
    const originalValues = object.value;
    if (originalValues) {
      const values = [] as ValueType[];
      for (let i = 0; i < originalValues.length; i += 2) {
        values.push({
          value: originalValues[i],
          score: originalValues[i + 1],
        });
      }
      setValues(values);
    }
  }, [props.object.value, refreshIndicator]);

  const [selected, setSelected] = React.useState<number>(-1);
  const [addRowDialogVisible, setAddRowDialogVisible] = React.useState(false);
  const [deleteRowDialogVisible, setDeleteRowDialogVisible] = React.useState(
    false
  );
  const [formData, updateFormData] = useImmer(initialFormData);
  const [score, setScore] = React.useState('');
  const [value, setValue] = React.useState('');

  const data = (values || []).slice().sort((a, b) => {
    return a.score.localeCompare(b.score);
  }) as Record<string, any>[];

  React.useEffect(() => {
    if (typeof selected === 'number') {
      if (selected > -1) {
        setScore(data[selected].score);
        setValue(data[selected].value);
      }
    }
  }, [selected, data]);

  const handleObjectScoreChange = (
    ev: React.ChangeEvent<{ value: string }>
  ) => {
    setScore(ev.target.value);
  };

  const handleAddRow = () => {
    setAddRowDialogVisible(true);
  };

  const handleAddRowCancel = () => {
    setAddRowDialogVisible(false);
  };

  const handleAddRowCommit = () => {
    const scoreNumValue = parseInt(formData.score);
    if (scoreNumValue === NaN) {
      showMessage('error', 'Score must be a number');
      return;
    }
    addZsetValue(object, scoreNumValue, formData.value);
    updateFormData((draft) => {
      resetFormData(draft, initialFormData);
    });
    handleAddRowCancel();
  };

  const handleDeleteRow = (selected: string | number) => {
    if (typeof selected === 'number') {
      deleteZsetValue(object, data[selected].value);
    }
  };

  const handleSelectRow = (selected: string | number) => {
    if (typeof selected === 'number') {
      setSelected(selected);
    }
  };

  const handleDeleteRowCancel = () => {
    setDeleteRowDialogVisible(false);
  };

  const handleDeleteRowCommit = () => {
    deleteZsetValue(object, values[selected].value);
    handleDeleteRowCancel();
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

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  const handleSaveValue = () => {
    if (selected > -1) {
      const scoreNumValue = parseInt(score);
      if (scoreNumValue === NaN) {
        showMessage('error', 'Score must be a number.');
        return;
      }
      updateZsetValue(props.object, data[selected].value, scoreNumValue, value);
    }
  };

  const columns = [
    {
      label: 'VALUE',
      key: 'value',
      width: 200,
      align: 'left' as ColumnAlign,
    },
    {
      label: 'SCORE',
      key: 'score',
      width: 100,
      align: 'right' as ColumnAlign,
    },
  ];

  return (
    <div className={classes.zsetValueRoot}>
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
        <div className={classes.scoreRoot}>
          <TextField
            spellCheck={false}
            fullWidth
            label="Score"
            variant="outlined"
            className={classes.inputScore}
            onChange={handleObjectScoreChange}
            value={score}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className={classes.valueRoot}>
          <Value
            label="Value"
            value={value}
            onValueChange={handleValueChange}
            onSaveValue={handleSaveValue}
            appSettings={appSettings}
            showMessage={showMessage}
          />
        </div>
      </div>
      <Dialog open={addRowDialogVisible} onClose={handleAddRowCancel}>
        <DialogTitle>Add Row</DialogTitle>
        <DialogContent className={classes.addRowDialogContent}>
          <TextField
            spellCheck={false}
            fullWidth
            label="Score"
            variant="outlined"
            value={formData.score}
            type="number"
            onChange={(ev) => handleChange(ev, 'score')}
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
      <Dialog open={deleteRowDialogVisible} onClose={handleDeleteRowCancel}>
        <DialogTitle>Delete Row</DialogTitle>
        <DialogContent>Do you really want to remove this row?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteRowCancel}>Cancel</Button>
          <Button onClick={handleDeleteRowCommit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
