import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField, Tooltip } from '@material-ui/core';
import _ from 'lodash';
import clsx from 'clsx';
import { HashDataObject, ZsetDataObject, SetDataObject } from '@src/types';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scannerRoot: {
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

export interface ScannerProps<
  T extends HashDataObject | SetDataObject | ZsetDataObject
> {
  object: T;
  scanBtnLabel: string;
  onFatchValues: (
    object: T,
    cursor: number,
    match: string,
    count: number
  ) => void;
}

export interface ScannerComponent {
  <T extends HashDataObject | SetDataObject | ZsetDataObject>(
    props: ScannerProps<T>
  ): React.ReactElement;
}

// @ts-ignore
export const Scanner: ScannerComponent = React.memo((props) => {
  const classes = useStyles();

  const { object, onFatchValues, scanBtnLabel } = props;

  const [match, setMatch] = React.useState(object.match);
  const [count, setCount] = React.useState(object.count);

  React.useEffect(() => {
    setMatch(object.match);
    setCount(object.count);
  }, [object.match, object.count]);

  const handleFetchValues = React.useCallback(() => {
    onFatchValues(object, 0, match, count);
  }, [object, onFatchValues, match, count]);

  const handleFetchNextValues = React.useCallback(() => {
    onFatchValues(object, object.lastCursor, match, count);
  }, [object, onFatchValues, match, count]);

  return (
    <div className={classes.scannerRoot}>
      <TextField
        label="Match"
        variant="outlined"
        value={match}
        onChange={(
          ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => setMatch(ev.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        className={clsx(classes.pageControlMargin, classes.pageControlInput)}
      />
      <TextField
        label="Count"
        variant="outlined"
        value={count}
        type="number"
        onChange={(
          ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => setCount(parseInt(ev.target.value))}
        InputLabelProps={{
          shrink: true,
        }}
        className={clsx(classes.pageControlMargin, classes.pageControlInput)}
      />
      <Button
        variant="contained"
        onClick={handleFetchValues}
        className={classes.pageControlMargin}
      >
        {scanBtnLabel}
      </Button>
      <Button
        variant="contained"
        onClick={handleFetchNextValues}
        disabled={object.lastCursor === 0}
      >
        <Tooltip title={object.lastCursor}>
          <span>Next</span>
        </Tooltip>
      </Button>
    </div>
  );
});
