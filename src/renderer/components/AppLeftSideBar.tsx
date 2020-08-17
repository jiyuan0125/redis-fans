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
} from '@src/constants';
import { DataObject, Settings } from '@src/types';
import clsx from 'clsx';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { TreeIcon } from '@src/icons/TreeIcon';
import fs from 'fs';
import electron from 'electron';
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
  loadObjects: (clean?: boolean) => void;
  addTerminalTab: (temporary: boolean) => void;
  addLuaEditorTab: (temporary: boolean) => void;
  serverConfig: Record<string, any>;
  objects: DataObject[];
  addObjectTab: (temporary: boolean, object: DataObject) => void;
  appSettings: Settings;
  advNameSpaceSeparator: string;
  activeObject?: DataObject;
  deleteObject: (object: DataObject) => void;
  //updateObjectOpenness: (object: DataObject, isOpen: boolean) => void;
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
  } = props;

  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [treeShowTypeSelected, setTreeShowTypeSelected] = React.useState(true);

  React.useEffect(() => {
    loadObjects(true);
  }, [activeDb]);

  const classes = useStyles(props);

  const handleOpenTerminal = (temporary: boolean) => {
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
  };

  const handleOpenLuaEditor = (temporary: boolean) => {
    addLuaEditorTab(temporary);
  };

  const handleAddObject = () => {
    setAppAddObjectDialogVisible(true);
  };

  const handleRefresh = () => {
    loadObjects();
    setLeftSideBarVisible(true);
  };

  const handleToggleLeftSideBar = () => {
    setLeftSideBarVisible(!leftSideBarVisible);
  };

  const handleChangeDb = (
    ev: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    selectDb(ev.target.value as string);
  };

  const dbs = _.range(parseInt(serverConfig.databases));

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
            <IconButton
              onClick={() => handleOpenTerminal(true)}
              onDoubleClick={() => handleOpenTerminal(false)}
            >
              <TerminalIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lua Editor">
            <IconButton
              onClick={() => handleOpenLuaEditor(true)}
              onDoubleClick={() => handleOpenLuaEditor(false)}
            >
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
              //updateObjectOpenness={updateObjectOpenness}
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
