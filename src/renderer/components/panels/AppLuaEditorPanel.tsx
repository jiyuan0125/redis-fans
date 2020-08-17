import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AppLuaEditor } from '@src/components/AppLuaEditor/index';
import { Tab, Session, MessageType, Settings } from '@src/types';
import { RedisResult } from '@src/hooks/useRedis';

export const useStyles = makeStyles(() =>
  createStyles({
    appLuaEditorPanelRoot: {
      height: '100%',
      display: 'flex',
      flexFlow: 'column nowrap',
    },
  })
);

export interface AppLuaEditorPanelProps {
  session: Session;
  tab: Tab;
  executeLua: (
    lua: string,
    numsOfKey: number,
    ...keyOrArgvs: any[]
  ) => Promise<RedisResult>;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
  appSettings: Settings;
}

export const AppLuaEditorPanel = React.memo((props: AppLuaEditorPanelProps) => {
  const classes = useStyles();
  const { session, executeLua, showMessage, appSettings } = props;

  return (
    <div className={classes.appLuaEditorPanelRoot}>
      <AppLuaEditor
        session={session}
        executeLua={executeLua}
        showMessage={showMessage}
        appSettings={appSettings}
      />
    </div>
  );
});
