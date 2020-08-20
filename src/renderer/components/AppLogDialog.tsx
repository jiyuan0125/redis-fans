import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  createStyles,
  List,
  ListItemText,
  ListItem,
  Theme,
} from '@material-ui/core';
import { Log } from '@src/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appLogDialogContent: {},
    logItem: {
      flexFlow: 'column',
      marginBottom: theme.spacing(1),
      alignItems: 'flex-start',
    },
  })
);

export interface AppLogDialogProps {
  appLogDialogVisible: boolean;
  setAppLogDialogVisible: (visible: boolean) => void;
  appRedisLogs: Log[];
}

export const AppLogDialog = React.memo((props: AppLogDialogProps) => {
  const { appLogDialogVisible, setAppLogDialogVisible, appRedisLogs } = props;
  const classes = useStyles();

  const handleClose = React.useCallback(() => {
    setAppLogDialogVisible(false);
  }, [setAppLogDialogVisible]);

  return (
    <div>
      <Dialog
        open={appLogDialogVisible}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        onClose={handleClose}
      >
        <DialogTitle>Logs</DialogTitle>
        <DialogContent className={classes.appLogDialogContent}>
          <List component="ul">
            {appRedisLogs?.map((log, index) => {
              return (
                <ListItem key={index} className={classes.logItem}>
                  <ListItemText
                    primary={`${log.time.toLocaleDateString()} ${log.time.toLocaleTimeString()} - Connection: ${
                      log.connection
                    } command: ${log.command} args: ${JSON.stringify(
                      log.args
                    )}`}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
