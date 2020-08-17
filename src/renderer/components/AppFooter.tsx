import React from 'react';
import { AppBar, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { UseGlobalHook } from '@src/hooks/useGlobal';
import clsx from 'clsx';
import electron from 'electron';
import packageConfig from '../../../package.json';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appFooterRoot: {
      height: 24,
      display: 'flex',
      alignItems: 'center',
      flexFlow: 'row',
      zIndex: theme.zIndex.drawer + 1,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    appFooterRootLeft: {
      flex: 1,
    },
    appFooterRootRight: {
      flex: 1,
      textAlign: 'right',
    },
    version: {
      fontSize: '0.8em',
      fontWeight: 'bold',
    },
    margin: {
      marginRight: theme.spacing(1),
    },
    appFooterButton: {
      fontSize: '0.8em',
      padding: 0,
    },
  })
);

export interface AppFooterProps {
  classes?: Record<string, any>;
  className?: string;
  useGlobalHook: UseGlobalHook;
}

export const AppFooter = React.memo((_props: AppFooterProps) => {
  const classes = useStyles();

  const handleFeedbackClick = () => {
    electron.shell.openExternal(
      'https://github.com/jiyuan0125/redis-fans/issues'
    );
  };

  return (
    <AppBar position="static" color="default" className={classes.appFooterRoot}>
      <div className={classes.appFooterRootLeft}></div>
      <div className={classes.appFooterRootRight}>
        <Button
          size="small"
          className={clsx(classes.margin, classes.appFooterButton)}
          onClick={handleFeedbackClick}
        >
          Feedback
        </Button>
        <span className={classes.version}>
          Version: {packageConfig.version}
        </span>
      </div>
    </AppBar>
  );
});
