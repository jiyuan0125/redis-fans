import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { DataObject, MessageType } from '@src/types';

const useStyles = makeStyles(() =>
  createStyles({
    appRenameKeyRoot: {
      display: 'flex',
    },
    appRenameKeyContent: {
      width: 600,
    },
  })
);

interface AppRenameProps {
  object: DataObject;
  renameDialogVisible: boolean;
  setRenameDialogVisible: (visible: boolean) => void;
  renameObjectKey: (object: DataObject, newKey: string) => void;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
}

export const AppRenameKey = React.memo((props: AppRenameProps) => {
  const classes = useStyles();
  const [key, setKey] = React.useState<string>(props.object.key);
  const {
    renameDialogVisible,
    setRenameDialogVisible,
    renameObjectKey,
    showMessage,
    object,
  } = props;

  React.useEffect(() => {
    setKey(object.key);
  }, [setKey, object.key]);

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setKey(ev.target.value);
    },
    [setKey]
  );

  const handleClose = React.useCallback(() => {
    setRenameDialogVisible(false);
  }, [setRenameDialogVisible]);

  const handleSubmit = React.useCallback(() => {
    if (!key) {
      showMessage('error', 'Key should not be empty.');
      return false;
    }
    renameObjectKey(object, key);
    handleClose();
  }, [key, showMessage, renameObjectKey, object, handleClose]);

  return (
    <div className={classes.appRenameKeyRoot}>
      <Dialog open={renameDialogVisible} onClose={handleClose}>
        <DialogTitle>Rename Key</DialogTitle>
        <DialogContent className={classes.appRenameKeyContent}>
          <TextField
            spellCheck={false}
            autoFocus
            margin="dense"
            id="key"
            label="new key"
            fullWidth
            value={key}
            onChange={handleChange}
            onKeyPress={(ev: React.KeyboardEvent) => {
              if (ev.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
