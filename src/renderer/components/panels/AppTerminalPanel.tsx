import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppTerminal } from '@src/components/AppTerminal/index';
import { Session, Settings } from '@src/types';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appTerminalPanelRoot: {
      paddingTop: theme.spacing(1),
      height: '100%',
    },
  })
);

export interface AppTerminalPanelProps {
  session: Session;
  appSettings: Settings;
}

export const AppTerminalPanel = React.memo((props: AppTerminalPanelProps) => {
  const classes = useStyles();
  const { session, appSettings } = props;

  return (
    <div className={classes.appTerminalPanelRoot}>
      <AppTerminal session={session} appSettings={appSettings} />
    </div>
  );
});
