import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import { useImmer } from 'use-immer';
import { ObjectDataType, Session, MessageType } from '@src/types';
import { resetFormData } from '@src/utils/common';

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      minWidth: 200,
    },
  })
);

const initialFormData = {
  key: '',
  type: 'string' as ObjectDataType,
  value: '',
  field: '',
  score: 0,
};

export interface AppAddObjectDialogProps {
  session: Session;
  appAddObjectDialogVisible: boolean;
  setAppAddObjectDialogVisible: (visible: boolean) => void;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
  createObject: (params: {
    dataType: ObjectDataType;
    key: string;
    value: string;
    field?: string;
    score?: number;
  }) => void;
}

export const AppAddObjectDialog = React.memo(
  (props: AppAddObjectDialogProps) => {
    const {
      appAddObjectDialogVisible,
      setAppAddObjectDialogVisible,
      createObject,
      showMessage,
    } = props;
    const [formData, updateFormData] = useImmer(initialFormData);
    const classes = useStyles();

    const handleChange = React.useCallback(
      (
        ev: React.ChangeEvent<{ name?: string; value: unknown }>,
        key: string
      ) => {
        ev.persist();
        updateFormData((draft) => {
          draft[key] = ev.target.value;
        });
      },
      [updateFormData]
    );

    const handleCancel = React.useCallback(() => {
      setAppAddObjectDialogVisible(false);
    }, [setAppAddObjectDialogVisible]);

    const validateForm = React.useCallback(() => {
      if (!formData.key) {
        showMessage('error', 'Key should not be empty.');
        return false;
      }
      if (!formData.value) {
        showMessage('error', 'Value should not be empty.');
        return false;
      }
      if (formData.type === 'hash') {
        if (!formData.field) {
          showMessage('error', 'Hash field should not be empty.');
          return false;
        }
      }
      if (formData.type === 'zset') {
        const scoreNumValue = parseInt(formData.score.toString());
        if (scoreNumValue === NaN) {
          showMessage('error', 'Score must be a number.');
          return false;
        }
      }

      return true;
    }, [formData, showMessage]);

    const handleSubmit = React.useCallback(() => {
      if (!validateForm()) return;
      createObject({
        key: formData.key,
        dataType: formData.type,
        value: formData.value,
        field: formData.field,
        score: formData.score,
      });
      updateFormData((draft) => {
        resetFormData(draft, initialFormData);
      });
      handleCancel();
    }, [
      validateForm,
      createObject,
      updateFormData,
      resetFormData,
      initialFormData,
      handleCancel,
    ]);

    return (
      <Dialog open={appAddObjectDialogVisible} onClose={handleCancel}>
        <DialogTitle>Add New Key to {props.session.name}</DialogTitle>
        <DialogContent>
          <TextField
            spellCheck={false}
            fullWidth
            multiline
            variant="outlined"
            rows={5}
            label="Key"
            value={formData.key}
            onChange={(ev) => handleChange(ev, 'key')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Type</InputLabel>
            <Select
              fullWidth
              label="Type"
              value={formData.type}
              onChange={(ev) => handleChange(ev, 'type')}
            >
              <MenuItem value="string">string</MenuItem>
              <MenuItem value="hash">hash</MenuItem>
              <MenuItem value="list">list</MenuItem>
              <MenuItem value="set">set</MenuItem>
              <MenuItem value="zset">sorted set</MenuItem>
            </Select>
          </FormControl>
          {formData.type === 'hash' && (
            <TextField
              spellCheck={false}
              fullWidth
              label="Field"
              multiline
              rows={5}
              variant="outlined"
              value={formData.field}
              onChange={(ev) => handleChange(ev, 'field')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          {formData.type === 'zset' && (
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
          )}
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
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    );
  }
);
