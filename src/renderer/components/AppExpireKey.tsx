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

  React.useEffect(() => {
    setExpire(props.object.expire ? props.object.expire.toString() : '-1');
  }, []);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setExpire(ev.target.value);
  };

  const handleClose = () => {
    setTtlDialogVisible(false);
  };

  const handleSubmit = () => {
    expireObject(props.object, parseInt(expire));
    handleClose();
  };

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
