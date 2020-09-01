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
import { DataObject } from '@src/types';

const useStyles = makeStyles(() =>
  createStyles({
    appExpireKeyRoot: {
      display: 'flex',
    },
    appExpireKeyContent: {
      width: 600,
    },
  })
);

interface AppExpireKeyProps {
  object: DataObject;
  ttlDialogVisible: boolean;
  setTtlDialogVisible: (visible: boolean) => void;
  expireObject: (object: DataObject, exprie: number) => void;
}

export const AppExpireKey = React.memo((props: AppExpireKeyProps) => {
  const { ttlDialogVisible, setTtlDialogVisible, expireObject } = props;
  const classes = useStyles();
  const [expire, setExpire] = React.useState<string>('-1');

  const { object } = props;

  React.useEffect(() => {
    setExpire(object.expire ? object.expire.toString() : '-1');
  }, []);

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setExpire(ev.target.value);
    },
    [setExpire]
  );

  const handleClose = React.useCallback(() => {
    setTtlDialogVisible(false);
  }, [setTtlDialogVisible]);

  const handleSubmit = React.useCallback(() => {
    expireObject(object, parseInt(expire));
    handleClose();
  }, [expireObject, object, handleClose]);

  return (
    <div className={classes.appExpireKeyRoot}>
      <Dialog
        open={ttlDialogVisible}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Set Key TTL</DialogTitle>
        <DialogContent className={classes.appExpireKeyContent}>
          <TextField
            spellCheck={false}
            autoFocus
            margin="dense"
            id="key"
            label="New TTL"
            fullWidth
            value={expire}
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
