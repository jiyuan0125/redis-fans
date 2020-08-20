import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar } from '@material-ui/core';
import { AppLeftSideBar } from '@src/components/AppLeftSideBar';
import { AppObjectPanel } from '@src/components/panels/AppObjectPanel';
import { AppTerminalPanel } from '@src/components/panels/AppTerminalPanel';
import { DataObject, Session, Tab, ObjectDataType } from '@src/types';
import { useService } from '@src/hooks/useService';
import { AppAddObjectDialog } from '@src/components/AppAddObjectDialog';
import { StringIcon } from '@src/icons/StringIcon';
import { HashIcon } from '@src/icons/HashIcon';
import { ListIcon } from '@src/icons/ListIcon';
import { SetIcon } from '@src/icons/SetIcon';
import { ZsetIcon } from '@src/icons/ZsetIcon';
import { TerminalIcon } from '@src/icons/TerminalIcon';
import { brown } from '@material-ui/core/colors';
import clsx from 'clsx';
import { LuaIcon } from '@src/icons/LuaIcon';
import { AppLuaEditorPanel } from './panels/AppLuaEditorPanel';
import {
  DIMENSION_APPLEFTSIDEBAR_WIDTH,
  DIMENSION_APPLEFTSIDEBAR_CLOSED_WIDTH,
  REACTDND_ITEMTYPE_TAB,
} from '@src/constants';
import { AppTabPanel } from './common/AppTabPane';
import { AppTabs } from './common/AppTabs';
import { AppSortableTab } from './common/AppSortableTab';
import { useAppTabContextMenu } from './common/useAppTabContextMenu';
import { areEqualShallow } from '@src/utils/common';
import { UseGlobalHook } from '@src/hooks/useGlobal';
import { useRedis } from '@src/hooks/useRedis';
import { UseSessionHook } from '@src/hooks/useSession';
import { UnknownIcon } from '@src/icons/UnknownIcon';
import { AppSessionFooter } from './AppSessionFooter';

const useStyles = makeStyles((theme: Theme) => ({
  appSessionContentContent: {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    //position: 'relative',
  },
  appBar: {
    minHeight: 33,
  },
  tab: {
    display: 'inline-flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    },
    '& span': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: 150,
    },
  },
  terminalTab: {
    color: brown.A700,
  },
  temporaryTab: {
    fontStyle: 'italic',
  },
}));

export interface AppSessionMainProps {
  session: Session;
  activeSessionId?: string;
  useGlobalHook: UseGlobalHook;
  useSessionHook: UseSessionHook;
}

export const AppSessionMain = React.memo(
  (props: AppSessionMainProps) => {
    const { session, useGlobalHook, useSessionHook } = props;
    const [leftSideBarVisible, setLeftSideBarVisible] = React.useState(true);
    const [leftSideBarWidth, setLeftSideBarWidth] = React.useState(
      DIMENSION_APPLEFTSIDEBAR_WIDTH
    );
    const [
      appAddObjectDialogVisible,
      setAppAddObjectDialogVisible,
    ] = React.useState(false);
    const useRedisHook = useRedis({ session, useSessionHook, useGlobalHook });
    const {
      globalState: { appSettings },
      showMessage,
    } = useGlobalHook;
    const {
      activeTabId,
      deleteTab,
      deleteOtherTabs,
      deleteTabsToTheRight,
      setActiveTabId,
      tabs,
      getObjectByTab,
      loadServerInfo,
      loadServerConfig,
      executeLua,
      loadObject,
      activeDb,
      selectDb,
      loadObjects,
      addTerminalTab,
      addLuaEditorTab,
      serverConfig,
      objects,
      addObjectTab,
      createObject,
      renameObjectKey,
      expireObject,
      deleteObject,
      updateStringValue,
      addHashField,
      updateHashField,
      updateHashValue,
      deleteHashField,
      addListValue,
      updateListValue,
      deleteListValue,
      addSetValue,
      updateSetValue,
      deleteSetValue,
      addZsetValue,
      updateZsetValue,
      deleteZsetValue,
      swapTab,
      activeObject,
      updateTabTemporary,
      fetchListValues,
      fetchHashValues,
      fetchSetValues,
      fetchZsetValues,
    } = useService({ session, useRedisHook, useSessionHook, useGlobalHook });
    const { showMenu } = useAppTabContextMenu({
      deleteTab,
      deleteOtherTabs,
      deleteTabsToTheRight,
    });
    const classes = useStyles();

    React.useEffect(() => {
      loadServerInfo();
      loadServerConfig();
    }, []);

    const handleTabChange = React.useCallback(
      (_ev: React.ChangeEvent<{}>, tabId: string) => {
        setActiveTabId(tabId);
      },
      [setActiveTabId]
    );

    const handleTabClose = React.useCallback(
      (_ev: React.MouseEvent, tab: Tab) => {
        deleteTab(tab);
      },
      [deleteTab]
    );

    const renderPanel = (session: Session, tab: Tab) => {
      switch (tab.type) {
        case 'object':
          return (
            <AppObjectPanel
              getObjectByTab={getObjectByTab}
              loadObject={loadObject}
              tab={tab}
              renameObjectKey={renameObjectKey}
              expireObject={expireObject}
              deleteObject={deleteObject}
              updateStringValue={updateStringValue}
              addHashField={addHashField}
              updateHashField={updateHashField}
              updateHashValue={updateHashValue}
              deleteHashField={deleteHashField}
              addListValue={addListValue}
              updateListValue={updateListValue}
              deleteListValue={deleteListValue}
              addSetValue={addSetValue}
              updateSetValue={updateSetValue}
              deleteSetValue={deleteSetValue}
              addZsetValue={addZsetValue}
              updateZsetValue={updateZsetValue}
              deleteZsetValue={deleteZsetValue}
              appSettings={appSettings}
              showMessage={showMessage}
              fetchListValues={fetchListValues}
              fetchHashValues={fetchHashValues}
              fetchSetValues={fetchSetValues}
              fetchZsetValues={fetchZsetValues}
            />
          );
        case 'terminal':
          return (
            <AppTerminalPanel session={session} appSettings={appSettings} />
          );
        case 'luaEditor':
          return (
            <AppLuaEditorPanel
              tab={tab}
              session={session}
              executeLua={executeLua}
              appSettings={appSettings}
              showMessage={showMessage}
            />
          );
        default:
          throw new Error('No matched tab type');
      }
    };

    const getLabel = (tab: Tab) => {
      switch (tab.type) {
        case 'object':
          const object = getObjectByTab(tab);
          if (object) {
            return getObjectLabel(object);
          } else {
            throw new Error('No object found by tab');
          }
        case 'terminal':
          return getTerminalLabel(tab);
        case 'luaEditor':
          return getLuaEditorLabel(tab);
        default:
          throw new Error(`Tab type ${tab.type} is not supported`);
      }
    };

    const getObjectLabel = (object: DataObject) => {
      switch (object.dataType) {
        case 'string':
          return (
            <div className={classes.tab}>
              <StringIcon />
              <span>{object.key}</span>
            </div>
          );
        case 'hash':
          return (
            <div className={classes.tab}>
              <HashIcon />
              <span>{object.key}</span>
            </div>
          );
        case 'list':
          return (
            <div className={classes.tab}>
              <ListIcon />
              <span>{object.key}</span>
            </div>
          );
        case 'set':
          return (
            <div className={classes.tab}>
              <SetIcon />
              <span>{object.key}</span>
            </div>
          );
        case 'zset':
          return (
            <div className={classes.tab}>
              <ZsetIcon />
              <span>{object.key}</span>
            </div>
          );
        default:
          return (
            <div className={classes.tab}>
              <UnknownIcon />
              <span>{object.key}</span>
            </div>
          );
      }
    };

    const getTerminalLabel = (tab: Tab) => {
      return (
        <div className={clsx(classes.tab, classes.terminalTab)}>
          <TerminalIcon />
          <span>{tab.name}</span>
        </div>
      );
    };

    const getLuaEditorLabel = (tab: Tab) => {
      return (
        <div className={clsx(classes.tab, classes.terminalTab)}>
          <LuaIcon />
          <span>{tab.name}</span>
        </div>
      );
    };

    const handleCreateObject = React.useCallback(
      (params: {
        dataType: ObjectDataType;
        key: string;
        value: string;
        field?: string;
        score?: number;
      }) => {
        createObject(params);
        setLeftSideBarVisible(true);
        loadObjects();
      },
      [createObject, setLeftSideBarVisible, loadObjects]
    );

    return (
      <>
        <AppLeftSideBar
          leftSideBarWidth={leftSideBarWidth}
          leftSideBarVisible={leftSideBarVisible}
          setLeftSideBarVisible={setLeftSideBarVisible}
          setLeftSideBarWidth={setLeftSideBarWidth}
          setAppAddObjectDialogVisible={setAppAddObjectDialogVisible}
          activeDb={activeDb}
          selectDb={selectDb}
          loadObjects={loadObjects}
          addTerminalTab={addTerminalTab}
          addLuaEditorTab={addLuaEditorTab}
          serverConfig={serverConfig}
          objects={objects}
          addObjectTab={addObjectTab}
          appSettings={appSettings}
          advNameSpaceSeparator={session.connection.advNameSpaceSeparator}
          activeObject={activeObject}
          deleteObject={deleteObject}
        />
        <div
          className={classes.appSessionContentContent}
          style={{
            marginLeft: leftSideBarVisible
              ? leftSideBarWidth
              : DIMENSION_APPLEFTSIDEBAR_CLOSED_WIDTH,
          }}
        >
          <AppBar position="static" color="default" className={classes.appBar}>
            <AppTabs
              value={activeTabId}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab, index) => (
                <AppSortableTab
                  className={clsx({ [classes.temporaryTab]: tab.temporary })}
                  key={tab.id}
                  label={getLabel(tab)}
                  value={tab.id}
                  onClose={(ev) => handleTabClose(ev, tab)}
                  onDoubleClick={() => updateTabTemporary(tab, false)}
                  index={index}
                  onSwap={swapTab}
                  type={REACTDND_ITEMTYPE_TAB}
                  onContextMenu={showMenu(tab)}
                />
              ))}
            </AppTabs>
          </AppBar>
          {session.tabs.map((tab) => (
            <AppTabPanel key={tab.id} value={tab.id} activeValue={activeTabId}>
              {renderPanel(session, tab)}
            </AppTabPanel>
          ))}
          <AppSessionFooter session={session} />
        </div>
        <AppAddObjectDialog
          session={session}
          appAddObjectDialogVisible={appAddObjectDialogVisible}
          setAppAddObjectDialogVisible={setAppAddObjectDialogVisible}
          createObject={handleCreateObject}
          showMessage={showMessage}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    if (nextProps.session.id === nextProps.activeSessionId) {
      return areEqualShallow(prevProps, nextProps);
    }
    return true;
  }
);
