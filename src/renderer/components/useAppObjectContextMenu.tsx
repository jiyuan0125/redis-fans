import React from 'react';
import { DataObject } from '@src/types';
import electron from 'electron';
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
const { Menu, MenuItem } = electron.remote;

export interface UseAppObjectListContextMenuProps {
  deleteObject: (object: DataObject) => void;
}

export const useAppObjectContextMenu = (
  props: UseAppObjectListContextMenuProps
) => {
  const { deleteObject } = props;
  const [
    deleteObjectConfirmDialogVisible,
    setDeleteObjectConfirmDialogVisible,
  ] = React.useState(false);
  const [object, setObject] = React.useState<DataObject>();

  const handleCopyKey = React.useCallback((object?: DataObject) => {
    //console.log(object);
    const listener = (ev: ClipboardEvent) => {
      ev.preventDefault();
      if (ev.clipboardData && object) {
        ev.clipboardData.setData('text/plain', object.key);
      }
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }, []);

  const handleDeleteKey = React.useCallback(
    (object?: DataObject) => {
      if (object) {
        setDeleteObjectConfirmDialogVisible(true);
      }
    },
    [setDeleteObjectConfirmDialogVisible]
  );

  const showMenu = React.useCallback(
    (object: DataObject) => (
      _event: React.MouseEvent<HTMLElement, MouseEvent>
    ) => {
      setObject(object);
      const menu = new Menu();
      menu.append(
        new MenuItem({
          id: 'copy',
          label: 'Copy Key',
          click() {
            handleCopyKey(object);
          },
        })
      );
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(
        new MenuItem({
          id: 'delete',
          label: 'Delete Key',
          click() {
            handleDeleteKey(object);
          },
        })
      );
      menu.popup({ window: electron.remote.getCurrentWindow() });
    },
    [setObject, handleCopyKey, handleDeleteKey]
  );

  const handleClose = React.useCallback(() => {
    setDeleteObjectConfirmDialogVisible(false);
  }, [setDeleteObjectConfirmDialogVisible]);

  const handleSubmit = React.useCallback(() => {
    if (object) {
      deleteObject(object);
    }
    handleClose();
  }, [object, deleteObject, handleClose]);

  const rendererMenu = () => {
    return (
      <Dialog
        open={deleteObjectConfirmDialogVisible}
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
    );
  };

  return {
    showMenu,
    rendererMenu,
  };
};
