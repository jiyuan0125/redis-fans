import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Message } from '@src/types';
import { createStyles, makeStyles } from '@material-ui/core';
const useStyles = makeStyles(() =>
  createStyles({
    title: {
      textTransform: 'capitalize',
    },
  })
);

export interface AppMessageProps {
  closeMessage: () => void;
  message?: Message;
}

export const AppMessage = React.memo((props: AppMessageProps) => {
  const { closeMessage, message } = props;
  const classes = useStyles();

  const handleClose = () => {
    closeMessage();
  };

  return (
    <Snackbar
      open={message?.visible}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={message?.type}>
        <AlertTitle className={classes.title}>{message?.type}</AlertTitle>
        {message?.text}
      </Alert>
    </Snackbar>
  );
});
