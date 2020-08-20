import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { ListDataObject } from '@src/types';
import clsx from 'clsx';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rangerRoot: {
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

export interface RangerProps<T extends ListDataObject> {
  object: T;
  onFetchValues: (object: T, start: number, stop: number) => void;
}

export interface RangerComponent {
  <T extends ListDataObject>(props: RangerProps<T>): React.ReactElement;
}

// @ts-ignore
export const Ranger: RangerComponent = React.memo((props) => {
  const classes = useStyles();
  const { object, onFetchValues } = props;

  const [start, setStart] = React.useState(object.lrangeStart);
  const [stop, setStop] = React.useState(object.lrangeStop);

  React.useEffect(() => {
    setStart(object.lrangeStart);
    setStop(object.lrangeStop);
  }, [object.lrangeStart, object.lrangeStop]);

  const handleFetchValues = React.useCallback(() => {
    onFetchValues(object, start, stop);
  }, [onFetchValues, object, start, stop]);

  const handleFetchNextValues = React.useCallback(() => {
    onFetchValues(object, stop + 1, stop + (stop - start) + 1);
  }, [onFetchValues, object, start, stop]);

  return (
    <div className={classes.rangerRoot}>
      <TextField
        label="Start"
        variant="outlined"
        value={start}
        type="number"
        onChange={(
          ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => setStart(parseInt(ev.target.value))}
        InputLabelProps={{
          shrink: true,
        }}
        className={clsx(classes.pageControlInput, classes.pageControlMargin)}
      />
      <TextField
        label="Stop"
        variant="outlined"
        value={stop}
        type="number"
        onChange={(
          ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => setStop(parseInt(ev.target.value))}
        InputLabelProps={{
          shrink: true,
        }}
        className={clsx(classes.pageControlInput, classes.pageControlMargin)}
      />
      <Button
        variant="contained"
        onClick={handleFetchValues}
        className={classes.pageControlMargin}
      >
        Lrange
      </Button>
      <Button
        variant="contained"
        onClick={handleFetchNextValues}
        disabled={object.total <= object.lrangeStop + 1}
      >
        Next
      </Button>
    </div>
  );
});
