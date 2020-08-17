import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { DataObject } from '@src/types';

const useStyles = makeStyles(() =>
  createStyles({
    appRenameRoot: {
      display: 'flex',
    },
  })
);

interface AppRenameProps {
  object: DataObject;
  deleteDialogVisible: boolean;
  setDeleteDialogVisible: (visible: boolean) => void;
  deleteObject: (object: DataObject) => void;
}

export const AppDeleteKey = React.memo((props: AppRenameProps) => {
  const { deleteDialogVisible, setDeleteDialogVisible, deleteObject } = props;
  const classes = useStyles();

  const handleClose = () => {
    setDeleteDialogVisible(false);
  };

  const handleSubmit = () => {
    deleteObject(props.object);
    handleClose();
  };

  return (
    <div className={classes.appRenameRoot}>
      <Dialog
        open={deleteDialogVisible}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete this key?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
