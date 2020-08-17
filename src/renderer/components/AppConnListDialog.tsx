import React from 'react';
import {
  Avatar,
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ConnectionIcon } from '../icons/ConnectionIcon';
import { Connection } from '@src/types';
import { AppConnEditDialog } from './AppConnEditDialog';
import { DeleteIcon } from '@src/icons/DeleteIcon';
import { AddIcon } from '@src/icons/AddIcon';
import { EditIcon } from '@src/icons/EditIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appConnListDialogRoot: {},
    appConnListDialogContent: {
      width: 600,
    },
    btnEdit: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    btnDelete: {
      '&:hover': {
        color: theme.palette.error.main,
      },
    },
  })
);

export interface AppConnListDialogProps {
  connListDialogVisible: boolean;
  setConnListDialogVisible: (visible: boolean) => void;
  loadConnectionsFromDB: () => void;
  connections: Connection[];
  deleteConnection: (connectionId: string) => void;
  connect: (connection: Connection) => void;
  saveConnection: (conn: Connection) => void;
  testConnection: (conn: Connection) => void;
}

export const AppConnListDialog = React.memo((props: AppConnListDialogProps) => {
  const [selected, setSelected] = React.useState('');
  const [connEditDialogVisible, setConnEditDialogVisible] = React.useState(
    false
  );
  const [deleteConnDialogVisible, setDeleteConnDialogVisible] = React.useState(
    false
  );
  const {
    connListDialogVisible,
    setConnListDialogVisible,
    loadConnectionsFromDB,
    connections,
    deleteConnection,
    connect,
    saveConnection,
    testConnection,
  } = props;
  const classes = useStyles();

  React.useEffect(() => {
    loadConnectionsFromDB();
  }, []);

  const handleClose = () => {
    setConnListDialogVisible(false);
  };

  const handleActiveSession = (connection: Connection) => {
    connect(connection);
    handleClose();
  };

  const handleDeleteConnection = (connectionId: string) => {
    setSelected(connectionId);
    setDeleteConnDialogVisible(true);
  };

  const handleEditConnection = (connectionId: string) => {
    setSelected(connectionId);
    setConnEditDialogVisible(true);
  };

  const handleAddConnection = () => {
    setSelected('');
    setConnEditDialogVisible(true);
  };

  const handleDeleteConnCancel = () => {
    setDeleteConnDialogVisible(false);
  };

  const handleDeleteConnCommit = () => {
    deleteConnection(selected);
    handleDeleteConnCancel();
  };

  return (
    <div className={classes.appConnListDialogRoot}>
      <Dialog open={connListDialogVisible} onClose={handleClose} scroll="paper">
        <DialogTitle id="scroll-dialog-title">Connections</DialogTitle>
        <DialogContent className={classes.appConnListDialogContent}>
          <List>
            {connections.map((c) => (
              <ListItem
                button
                key={c.id}
                onClick={() => handleActiveSession(c)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <ConnectionIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={c.name}
                  secondary={`${c.host}:${c.port}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    className={classes.btnEdit}
                    onClick={() => handleEditConnection(c.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    className={classes.btnDelete}
                    onClick={() => handleDeleteConnection(c.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <ListItem key="add" button onClick={handleAddConnection}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteConnDialogVisible} onClose={handleDeleteConnCancel}>
        <DialogTitle>Delete Connection</DialogTitle>
        <DialogContent>
          Do you really want to remove this connection?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConnCancel}>Cancel</Button>
          <Button onClick={handleDeleteConnCommit}>Delete</Button>
        </DialogActions>
      </Dialog>
      <AppConnEditDialog
        connEditDialogVisible={connEditDialogVisible}
        setConnEditDialogVisible={setConnEditDialogVisible}
        connection={connections.find((c) => c.id === selected)}
        saveConnection={saveConnection}
        testConnection={testConnection}
      />
    </div>
  );
});
