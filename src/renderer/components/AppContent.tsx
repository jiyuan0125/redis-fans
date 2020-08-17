import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  AppBar,
  CircularProgress,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import { useGlobal, UseGlobalHook } from '@src/hooks/useGlobal';
import { useSession } from '@src/hooks/useSession';
import { AppConnListDialog } from '@src/components/AppConnListDialog';
import { AppSettingsDialog } from '@src/components/AppSettingsDialog';
import { useSessionTab } from '@src/hooks/useSessionTab';
import clsx from 'clsx';
import { AppSessionMain } from '@src/components/AppSessionMain';
import { StatusIcon } from '@src/icons/StatusIcon';
import { blue, green, red, yellow } from '@material-ui/core/colors';
import { LogIcon } from '@src/icons/LogIcon';
import { SettingIcon } from '@src/icons/SettingIcon';
import { Session } from '@src/types';
import { AppLogDialog } from './AppLogDialog';
import electron, { MenuItemConstructorOptions } from 'electron';
import {
  DIMENSION_APPHEADER_HEIGHT,
  REACTDND_ITEMTYPE_SESSIONTAB,
} from '@src/constants';
import { useConn } from '@src/hooks/useConn';
import { AppTabs } from './common/AppTabs';
import { AppSortableTab } from './common/AppSortableTab';
import { AppTabPanel } from './common/AppTabPane';
import { ConnectionIcon } from '@src/icons/ConnectionIcon';
import { useImmer } from 'use-immer';
import { getMenuTemplate } from './menuTemplate';
import { deleteSessionTabOrTab } from '@src/utils/common';

const { Menu, app, process } = electron.remote;
const isMac = process.platform === 'darwin';
const template = getMenuTemplate(app, isMac);

const useStyles = makeStyles((theme: Theme) => ({
  appContentRoot: {
    display: 'flex',
    flexDirection: 'column',
  },
  appContentHeader: {
    zIndex: theme.zIndex.drawer + 1,
    '-webkit-app-region': 'drag',
  },
  appContentHeaderToolbar: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    paddingLeft: 60,
    minHeight: DIMENSION_APPHEADER_HEIGHT,
    '& .MuiIconButton-sizeSmall': {
      padding: 6,
    },
  },
  appContentHeaderMain: {
    display: 'flex',
    flexGrow: 1,
  },
  appContentHeaderAdd: {
    color: theme.palette.primary.contrastText,
  },
  appContentHeaderMenuButton: {
    marginRight: theme.spacing(2),
  },
  appContentHeaderGrow: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  appSessionContentRoot: {
    flexGrow: 1,
    position: 'relative',
  },
  appContentHeaderTail: {},
  sessionTabLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    '& .status': {
      marginRight: theme.spacing(1),
    },
  },
  sessionTab: {
    '-webkit-app-region': 'no-drag',
    color: theme.palette.grey.A100,
  },
  statusReady: {
    color: green.A700,
  },
  statusConnect: {
    color: green.A700,
  },
  statusReconnecting: {
    color: blue.A700,
  },
  statusError: {
    color: red.A700,
  },
  statusEnd: {
    color: red.A700,
  },
  statusWarning: {
    color: yellow.A700,
  },
  progress: {
    position: 'absolute',
    top: 11,
    left: 8,
  },
  activeDb: {
    fontWeight: 'bold',
    color: green[800],
  },
  welcome: {
    flex: 1,
    textAlign: 'center',
    fontSize: '1.5em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export interface AppContentProps {
  classes?: Record<string, any>;
  className?: string;
  useGlobalHook: UseGlobalHook;
}

export const AppContent = React.memo((props: AppContentProps) => {
  const { useGlobalHook } = props;
  const useSessionHook = useSession();
  const useSessionTabHook = useSessionTab({ useSessionHook });
  const useConnHook = useConn({
    useGlobalHook,
    useSessionHook,
    useSessionTabHook,
  });
  const {
    globalState: { appRedisLogs, appSettings },
    saveAppSettings,
  } = useGlobalHook;
  const {
    sessionState: { sessionTabs, activeSessionId },
    setActiveSessionId,
    updateSessionState,
  } = useSessionHook;
  const {
    deleteSessionTab,
    activeSessionTab,
    getSessionByTabId,
    swapSessionTab,
  } = useSessionTabHook;
  const {
    connState: { connections },
    loadConnectionsFromDB,
    deleteConnection,
    connect,
    saveConnection,
    testConnection,
  } = useConnHook;
  const [appLogDialogVisible, setAppLogDialogVisible] = React.useState(false);
  const [
    appSettingsDialogVisible,
    setAppSettingsDialogVisible,
  ] = React.useState(false);
  const [connListDialogVisible, setConnListDialogVisible] = React.useState(
    false
  );

  const classes = useStyles(useGlobal());

  const [menuTemplate, updateMenuTemplate] = useImmer<
    Array<MenuItemConstructorOptions>
  >(template);

  // Register menu handlers
  React.useEffect(() => {
    updateMenuTemplate((draft) => {
      draft![1].submenu![0].click = () => {
        setConnListDialogVisible(true);
      };
      if (isMac) {
        draft![0].submenu![2].click = () => {
          setAppSettingsDialogVisible(true);
        };
        draft![1].submenu![1].click = () => {
          deleteSessionTabOrTab(updateSessionState);
        };
      }
    });
  }, [updateSessionState]);

  React.useEffect(() => {
    const appMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(appMenu);
  }, [menuTemplate]);

  const handleConnListClick = () => {
    setConnListDialogVisible(true);
  };

  const handleLogClick = () => {
    setAppLogDialogVisible(true);
  };

  const handleSettingsClick = () => {
    setAppSettingsDialogVisible(true);
  };

  const handleSessionTabChange = (
    _ev: React.ChangeEvent<{}>,
    sessionId: string
  ) => {
    setActiveSessionId(sessionId);
  };

  const handleSessionTabClose = (sessionTabId: string) => {
    deleteSessionTab(sessionTabId);
  };

  const getStatusIconClassName = (session: Session) => {
    switch (session.status) {
      case 'ready':
        return classes.statusReady;
      case 'connect':
        return classes.statusConnect;
      case 'reconnecting':
        return classes.statusReconnecting;
      case 'error':
        return classes.statusError;
      case 'end':
        return classes.statusEnd;
      case 'warning':
        return classes.statusWarning;
      default:
        throw new Error(`Unsupported session status ${session.status}`);
    }
  };

  const getLabel = (sessionTab: string) => {
    const session = getSessionByTabId(sessionTab);
    if (!session) return sessionTab;

    return (
      <div className={classes.sessionTabLabel}>
        {session.progressing && (
          <CircularProgress size={12} className={classes.progress} />
        )}
        <StatusIcon
          className={clsx('status', getStatusIconClassName(session))}
        />
        <span>
          {session.name}
          {' » '}
          <span className={classes.activeDb}>{session.activeDb}</span>
        </span>
      </div>
    );
  };

  const handleHeaderClick = () => {
    const browserWindow = electron.remote.getCurrentWindow();
    if (!browserWindow.isMaximized()) {
      browserWindow.maximize();
    } else {
      browserWindow.unmaximize();
    }
  };

  return (
    <div
      className={clsx(
        classes.appContentRoot,
        props.classes?.root,
        props.className
      )}
    >
      <AppBar
        onDoubleClick={handleHeaderClick}
        position="static"
        className={classes.appContentHeader}
      >
        <Toolbar variant="dense" className={classes.appContentHeaderToolbar}>
          <IconButton
            onClick={handleConnListClick}
            className={classes.appContentHeaderAdd}
          >
            <ConnectionIcon />
          </IconButton>
          <div className={classes.appContentHeaderMain}>
            <AppTabs
              value={activeSessionTab}
              onChange={handleSessionTabChange}
              indicatorColor="secondary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {sessionTabs.map((st, index) => (
                <AppSortableTab
                  key={st}
                  label={getLabel(st)}
                  value={st}
                  onClose={() => handleSessionTabClose(st)}
                  index={index}
                  onSwap={swapSessionTab}
                  type={REACTDND_ITEMTYPE_SESSIONTAB}
                  className={classes.sessionTab}
                />
              ))}
            </AppTabs>
          </div>
          <div className={classes.appContentHeaderTail}>
            <IconButton onClick={handleLogClick} color="inherit">
              <LogIcon />
            </IconButton>
            <IconButton onClick={handleSettingsClick} color="inherit">
              <SettingIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {sessionTabs.length > 0 &&
        sessionTabs.map((st) => {
          const session = getSessionByTabId(st);
          if (session) {
            return (
              <AppTabPanel
                className={classes.appSessionContentRoot}
                key={session.id}
                value={session.id}
                activeValue={activeSessionId}
              >
                <AppSessionMain
                  key={st}
                  session={session}
                  activeSessionId={activeSessionId}
                  useGlobalHook={useGlobalHook}
                  useSessionHook={useSessionHook}
                />
              </AppTabPanel>
            );
          }
        })}
      {sessionTabs.length === 0 && (
        <div className={classes.welcome}>
          Click
          <IconButton onClick={handleConnListClick}>
            <ConnectionIcon />
          </IconButton>
          <span>or "File -{'>'} Connections" to open Connection List.</span>
        </div>
      )}
      <AppConnListDialog
        connListDialogVisible={connListDialogVisible}
        setConnListDialogVisible={setConnListDialogVisible}
        loadConnectionsFromDB={loadConnectionsFromDB}
        connections={connections}
        deleteConnection={deleteConnection}
        connect={connect}
        saveConnection={saveConnection}
        testConnection={testConnection}
      />
      <AppLogDialog
        appLogDialogVisible={appLogDialogVisible}
        setAppLogDialogVisible={setAppLogDialogVisible}
        appRedisLogs={appRedisLogs}
      />
      <AppSettingsDialog
        appSettingsDialogVisible={appSettingsDialogVisible}
        setAppSettingsDialogVisible={setAppSettingsDialogVisible}
        saveAppSettings={saveAppSettings}
        appSettings={appSettings}
      />
    </div>
  );
});
