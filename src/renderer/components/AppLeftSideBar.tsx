import React from 'react';
import {
  Drawer,
  createStyles,
  Theme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppSearchBar } from '@src/components/AppSearchBar';
import { AppObjectList } from '@src/components/AppObjectList';
import IconButton from '@material-ui/core/IconButton';
import { RefreshIcon } from '@src/icons/RefreshIcon';
import { TerminalIcon } from '@src/icons/TerminalIcon';
import { LeftIcon } from '@src/icons/LeftIcon';
import { RightIcon } from '@src/icons/RightIcon';
import { AddIcon } from '@src/icons/AddIcon';
import { LuaIcon } from '@src/icons/LuaIcon';
import _ from 'lodash';
import { AppResizer } from './AppResizer';
import {
  DIMENSION_APPFOOTER_HEIGHT,
  DIMENSION_APPHEADER_HEIGHT,
  DIMENSION_APPLEFTSIDEBAR_CLOSED_WIDTH,
  DIMENSION_APPLEFTSIDEBAR_WIDTH_MINSIZE,
  DIMENSION_APPLEFTSIDEBAR_WIDTH_MAXSIZE,
  DEFAULT_MATCH_STR,
  DEFAULT_SCAN_COUNT,
} from '@src/constants';
import { DataObject, Settings, Session } from '@src/types';
import clsx from 'clsx';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { TreeIcon } from '@src/icons/TreeIcon';
import fs from 'fs';
import electron from 'electron';
import { getRedisClient } from '@src/utils/redis';
const browserWindow = electron.remote.getCurrentWindow();
const remote = electron.remote;
const process = electron.remote.process;
const shell = electron.shell;
const isMac = process.platform === 'darwin';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerRoot: {
      '& .MuiPaper-root': {
        overflow: 'visible',
      },
    },
    drawerOpen: {
      width: (props: AppLeftSideBarProps) =>
        props.leftSideBarVisible
          ? props.leftSideBarWidth
          : DIMENSION_APPLEFTSIDEBAR_CLOSED_WIDTH,
      transition: theme.transitions.create(['width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      flexShrink: 0,
    },
    drawerClose: {
      width: DIMENSION_APPLEFTSIDEBAR_CLOSED_WIDTH,
      transition: theme.transitions.create(['width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      flexShrink: 0,
    },
    appLeftSideBarPaper: {
      width: (props: AppLeftSideBarProps) =>
        props.leftSideBarVisible
          ? props.leftSideBarWidth
          : DIMENSION_APPLEFTSIDEBAR_CLOSED_WIDTH,
      height: `calc(100% - ${DIMENSION_APPHEADER_HEIGHT}px -
          ${DIMENSION_APPFOOTER_HEIGHT}px)`,
      boxSizing: 'border-box',
      top: DIMENSION_APPHEADER_HEIGHT,
    },
    appLeftSideBarRoot: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    appLeftSideBarButtons: {
      height: 40,
    },
    appLeftSideBarHeader: {
      display: 'flex',
      flexFlow: 'column',
    },
    appLeftSideScanner: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    appLeftSideSearchContainer: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    appLeftSideBarSearchBar: {
      position: 'relative',
      flexGrow: 1,
    },
    appLeftSideBarDbSelector: {
      width: 50,
      boxSizing: 'border-box',
      marginRight: theme.spacing(1),
    },
    appLeftSideBarObjectList: {
      flexGrow: 1,
      // overflow: 'auto',
      display: 'flex',
      flexFlow: 'column',
    },
    btnShowType: {
      marginRight: theme.spacing(1),
      width: 32,
      height: 32,
      borderRadius: '50%',
    },
    pageControlMargin: {
      marginRight: theme.spacing(1),
    },
    pageControlInput: {
      flex: 1,
    },
  })
);

export interface AppLeftSideBarProps {
  leftSideBarWidth: number;
  leftSideBarVisible: boolean;
  setLeftSideBarVisible: (visible: boolean) => void;
  setLeftSideBarWidth: (size: number) => void;
  setAppAddObjectDialogVisible: (visible: boolean) => void;
  activeDb: string;
  selectDb: (value: string) => void;
  loadObjects: (clean?: boolean, match?: string, count?: number) => void;
  addTerminalTab: (temporary: boolean) => void;
  addLuaEditorTab: (temporary: boolean) => void;
  serverConfig: Record<string, any>;
  objects: DataObject[];
  addObjectTab: (temporary: boolean, object: DataObject) => void;
  appSettings: Settings;
  advNameSpaceSeparator: string;
  activeObject?: DataObject;
  deleteObject: (object: DataObject) => void;
  scanDone: boolean;
  session: Session;
}

export const AppLeftSideBar = React.memo((props: AppLeftSideBarProps) => {
  const {
    activeDb,
    selectDb,
    loadObjects,
    addTerminalTab,
    addLuaEditorTab,
    serverConfig,
    leftSideBarVisible,
    setLeftSideBarVisible,
    leftSideBarWidth,
    setLeftSideBarWidth,
    setAppAddObjectDialogVisible,
    objects,
    addObjectTab,
    appSettings,
    advNameSpaceSeparator,
    activeObject,
    deleteObject,
    scanDone,
    session,
  } = props;

  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [treeShowTypeSelected, setTreeShowTypeSelected] = React.useState(true);

  React.useEffect(() => {
    getRedisClient(session).then((redisClient) => {
      if (redisClient.ready) {
        loadObjects(true, DEFAULT_MATCH_STR, DEFAULT_SCAN_COUNT);
      } else {
        redisClient.on('ready', () => {
          loadObjects(true, DEFAULT_MATCH_STR, DEFAULT_SCAN_COUNT);
        });
      }
    });
  }, [activeDb]);

  const [match, setMatch] = React.useState(DEFAULT_MATCH_STR);
  const [count, setCount] = React.useState(DEFAULT_SCAN_COUNT);

  const classes = useStyles(props);

  const handleOpenTerminal = React.useCallback(
    (temporary: boolean) => {
      if (isMac) {
        const nodeExists = fs.existsSync('/usr/local/bin/node');
        if (!nodeExists) {
          const result = remote.dialog.showMessageBoxSync(browserWindow, {
            type: 'error',
            message: 'Node command not found in your system.',
            buttons: ['Ok', 'Download'],
          });
          if (result === 1) {
            shell.openExternal('https://nodejs.org/en/download/');
          }
          return;
        }
      }
      addTerminalTab(temporary);
    },
    [addTerminalTab]
  );

  const handleOpenLuaEditor = React.useCallback(
    (temporary: boolean) => {
      addLuaEditorTab(temporary);
    },
    [addLuaEditorTab]
  );

  const handleAddObject = React.useCallback(() => {
    setAppAddObjectDialogVisible(true);
  }, [setAppAddObjectDialogVisible]);

  const handleRefresh = React.useCallback(() => {
    loadObjects(true, match, count);
    setLeftSideBarVisible(true);
  }, [loadObjects, setLeftSideBarVisible]);

  const handleToggleLeftSideBar = React.useCallback(() => {
    setLeftSideBarVisible(!leftSideBarVisible);
  }, [setLeftSideBarVisible, leftSideBarVisible]);

  const handleChangeDb = React.useCallback(
    (ev: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      selectDb(ev.target.value as string);
    },
    [selectDb]
  );

  const dbs = React.useMemo(() => _.range(parseInt(serverConfig.databases)), [
    serverConfig.databases,
  ]);

  const handleLoadObjects = () => {
    loadObjects(true, match, count);
  };

  const handleLoadNextObjects = () => {
    loadObjects(true);
  };

  return (
    <Drawer
      className={clsx(classes.drawerRoot, {
        [classes.drawerOpen]: leftSideBarVisible,
        [classes.drawerClose]: !leftSideBarVisible,
      })}
      classes={{
        paper: clsx(
          {
            [classes.drawerOpen]: leftSideBarVisible,
            [classes.drawerClose]: !leftSideBarVisible,
          },
          classes.appLeftSideBarPaper
        ),
      }}
      variant="permanent"
      anchor="left"
    >
      <div className={classes.appLeftSideBarRoot}>
        <div className={classes.appLeftSideBarButtons}>
          <Tooltip
            title={
              leftSideBarVisible ? 'Collapse the Sidebar' : 'Expand the Sidebar'
            }
          >
            <IconButton onClick={handleToggleLeftSideBar}>
              {leftSideBarVisible ? <LeftIcon /> : <RightIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="New Key">
            <IconButton onClick={handleAddObject}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Terminal">
            <IconButton onClick={() => handleOpenTerminal(false)}>
              <TerminalIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lua Editor">
            <IconButton onClick={() => handleOpenLuaEditor(false)}>
              <LuaIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        {leftSideBarVisible && (
          <>
            <div className={classes.appLeftSideBarHeader}>
              <div className={classes.appLeftSideScanner}>
                <TextField
                  label="Match"
                  variant="outlined"
                  value={match}
                  onChange={(
                    ev: React.ChangeEvent<
                      HTMLTextAreaElement | HTMLInputElement
                    >
                  ) => setMatch(ev.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={clsx(
                    classes.pageControlMargin,
                    classes.pageControlInput
                  )}
                />
                <TextField
                  label="Count"
                  variant="outlined"
                  value={count}
                  type="number"
                  onChange={(
                    ev: React.ChangeEvent<
                      HTMLTextAreaElement | HTMLInputElement
                    >
                  ) => setCount(parseInt(ev.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={clsx(
                    classes.pageControlMargin,
                    classes.pageControlInput
                  )}
                />
                <Button
                  variant="contained"
                  onClick={handleLoadObjects}
                  className={classes.pageControlMargin}
                >
                  Scan
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLoadNextObjects}
                  disabled={scanDone}
                >
                  <span>Next</span>
                </Button>
              </div>
              <div className={classes.appLeftSideSearchContainer}>
                <Tooltip title="Tree / Flat">
                  <ToggleButton
                    value="check"
                    selected={treeShowTypeSelected}
                    className={classes.btnShowType}
                    onChange={() => {
                      setTreeShowTypeSelected(!treeShowTypeSelected);
                    }}
                  >
                    <TreeIcon />
                  </ToggleButton>
                </Tooltip>
                <AppSearchBar
                  searchKeyword={searchKeyword}
                  setSearchKeyword={setSearchKeyword}
                  className={classes.appLeftSideBarSearchBar}
                />
                <FormControl
                  variant="outlined"
                  className={classes.appLeftSideBarDbSelector}
                >
                  <InputLabel>DB</InputLabel>
                  <Select
                    fullWidth
                    label="DB"
                    value={activeDb}
                    onChange={(ev) => handleChangeDb(ev)}
                  >
                    {dbs.map((db) => (
                      <MenuItem key={db} value={db}>
                        {db}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <AppObjectList
              searchKeyword={searchKeyword}
              className={classes.appLeftSideBarObjectList}
              objects={objects}
              addObjectTab={addObjectTab}
              appSettings={appSettings}
              advNameSpaceSeparator={advNameSpaceSeparator}
              showType={treeShowTypeSelected ? 'tree' : 'flat'}
              activeObject={activeObject}
              deleteObject={deleteObject}
            />
          </>
        )}
      </div>
      {leftSideBarVisible && (
        <AppResizer
          size={leftSideBarWidth}
          minSize={DIMENSION_APPLEFTSIDEBAR_WIDTH_MINSIZE}
          maxSize={DIMENSION_APPLEFTSIDEBAR_WIDTH_MAXSIZE}
          position="right"
          onSizeChange={(size: number) => setLeftSideBarWidth(size)}
        />
      )}
    </Drawer>
  );
});
