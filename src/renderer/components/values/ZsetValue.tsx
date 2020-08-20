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
  ZsetValueType,
  ZsetDataObject,
} from '@src/types';
import { useImmer } from 'use-immer';
import { resetFormData } from '@src/utils/common';
import { useGlobal } from '@src/hooks/useGlobal';
import { Rows, ColumnAlign } from './Rows';
import { Value } from './Value';
import { DIMENSION_ROWS_WIDTH_MAXSIZE } from '@src/constants';
import { Scanner } from './Scaner';

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
    pageControl: {
      display: 'flex',
      alignItems: 'center',
    },
    total: {
      width: 100,
      display: 'flex',
      marginRight: theme.spacing(1),
    },
    totalLabel: {
      fontWeight: 'bold',
      width: 50,
    },
    totalValue: {
      flex: 1,
      textAlign: 'right',
    },
    pageControlInput: {
      flex: 1,
    },
    pageControlMargin: {
      marginRight: theme.spacing(1),
    },
  })
);

const initialFormData = {
  score: '0',
  value: '',
};

interface ZsetValueProp {
  object: ZsetDataObject;
  addZsetValue: (object: ZsetDataObject, score: number, value: string) => void;
  updateZsetValue: (
    object: ZsetDataObject,
    oldValue: string,
    score: number,
    newValue: string
  ) => void;
  deleteZsetValue: (object: ZsetDataObject, value: string) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
  fetchZsetValues: (
    object: ZsetDataObject,
    cursor: number,
    match: string,
    count: number
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
    fetchZsetValues,
  } = props;
  const classes = useStyles();
  const [rowsSize, setRowsSize] = React.useState<number>(
    DIMENSION_ROWS_WIDTH_MAXSIZE
  );

  const [selected, setSelected] = React.useState<number>(-1);
  const [addRowDialogVisible, setAddRowDialogVisible] = React.useState(false);
  const [deleteRowDialogVisible, setDeleteRowDialogVisible] = React.useState(
    false
  );
  const [formData, updateFormData] = useImmer(initialFormData);
  const [score, setScore] = React.useState('');
  const [value, setValue] = React.useState('');

  const data = React.useMemo(
    () =>
      object.values ||
      (([] as ZsetValueType[]).slice().sort((a, b) => {
        return a.score.toString().localeCompare(b.score.toString());
      }) as Record<string, any>[]),
    [object.values]
  );

  React.useEffect(() => {
    if (selected !== -1) {
      setScore(data[selected]?.score?.toString());
      setValue(data[selected]?.value);
    }
  }, [selected, setScore, setValue, data, refreshIndicator]);

  const handleObjectScoreChange = React.useCallback(
    (ev: React.ChangeEvent<{ value: string }>) => {
      setScore(ev.target.value);
    },
    [setScore]
  );

  const handleAddRow = React.useCallback(() => {
    setAddRowDialogVisible(true);
  }, [setAddRowDialogVisible]);

  const handleAddRowCancel = React.useCallback(() => {
    setAddRowDialogVisible(false);
  }, [setAddRowDialogVisible]);

  const handleAddRowCommit = React.useCallback(() => {
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
  }, [
    formData,
    showMessage,
    addZsetValue,
    object,
    updateFormData,
    resetFormData,
    initialFormData,
    handleAddRowCancel,
  ]);

  const handleDeleteRow = React.useCallback(
    (selected: number) => {
      deleteZsetValue(object, data[selected].value);
    },
    [deleteZsetValue, object, data]
  );

  const handleSelectRow = React.useCallback(
    (selected: number) => {
      setSelected(selected);
    },
    [setSelected]
  );

  const handleDeleteRowCancel = React.useCallback(() => {
    setDeleteRowDialogVisible(false);
  }, [setDeleteRowDialogVisible]);

  const handleDeleteRowCommit = React.useCallback(() => {
    deleteZsetValue(object, data[selected].value);
    handleDeleteRowCancel();
  }, [deleteZsetValue, object, data, selected, handleDeleteRowCancel]);

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<{ value: string }>, field: string) => {
      ev.persist();
      updateFormData((draft) => {
        draft[field] = ev.target.value;
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
      const scoreNumValue = parseInt(score);
      if (scoreNumValue === NaN) {
        showMessage('error', 'Score must be a number.');
        return;
      }
      updateZsetValue(object, data[selected].value, scoreNumValue, value);
    }
  }, [selected, score, object, data, value]);

  const columns = [
    {
      label: 'VALUE',
      key: 'value',
      flex: 2,
      align: 'left' as ColumnAlign,
    },
    {
      label: 'SCORE',
      key: 'score',
      flex: 1,
      align: 'right' as ColumnAlign,
    },
  ];

  return (
    <div className={classes.zsetValueRoot}>
      <div className={classes.left} style={{ width: rowsSize }}>
        <Scanner<ZsetDataObject>
          object={object}
          onFatchValues={fetchZsetValues}
          scanBtnLabel="zscan"
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
