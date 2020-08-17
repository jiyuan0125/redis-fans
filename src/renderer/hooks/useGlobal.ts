import React from 'react';
import {
  MessageType,
  Settings,
  TerminalTheme,
  Message,
  Log,
  Updater,
} from '@src/types';
import db from '@src/utils/db';
import { useImmer } from 'use-immer';

const initialValue = {
  message: {} as Message,
  appRedisLogs: [] as Log[],
  appSettings: {
    id: 'default',
    language: 'English',
    uiFont: 'monospace',
    uiFontSize: 11,
    editorFont: 'monospace',
    editorFontSize: 11,
    terminalFont: 'monospace',
    terminalFontSize: 11,
    terminalTheme: 'github' as TerminalTheme,
    useSystemProxySettings: false,
    reopenNamespacesOnReload: false,
    enableKeySortingInTree: false,
    liveUpdateMaximumAllowedKeys: 1000,
    liveUpdateInterval: 10,
  } as Settings,
};

export type GlobalState = typeof initialValue;

export interface UseGlobalHook {
  globalState: GlobalState;
  updateGlobalState: Updater<GlobalState>;
  setMessage: (visible: boolean, type: MessageType, text: string) => void;
  showMessage: (type: MessageType, content: string) => void;
  closeMessage: (type: MessageType, content: string) => void;
  handleError: (error: Error) => void;
  loadAppSettingsFromDB: () => void;
  saveAppSettings: (appSettings: Settings) => void;
  redisLog: (connection: string, command: string, ...args: any[]) => void;
}

export const useGlobal = () => {
  const [globalState, updateGlobalState] = useImmer(initialValue);

  const setMessage = React.useCallback(
    (visible: boolean, type: MessageType, text: string) => {
      updateGlobalState((state) => {
        state.message = {
          visible,
          type,
          text,
        };
      });
    },
    []
  );

  const showMessage = React.useCallback(
    (type: MessageType, content: string) => {
      setMessage(true, type, content);
    },
    [setMessage]
  );

  const closeMessage = React.useCallback(() => {
    setMessage(false, 'info', '');
  }, [setMessage]);

  const handleError = React.useCallback(
    (error: Error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error(error);
      }
      showMessage('error', `${error.name}: ${error.message}`);
    },
    [showMessage]
  );

  const loadAppSettingsFromDB = React.useCallback(async () => {
    const settingsFromDB = await db.settings.get('default');
    if (settingsFromDB) {
      updateGlobalState((draft) => {
        draft.appSettings = settingsFromDB;
      });
    }
  }, []);

  const saveAppSettings = React.useCallback(async (appSettings: Settings) => {
    await db.settings.put(appSettings);
    updateGlobalState((draft) => {
      draft.appSettings = appSettings;
    });
  }, []);

  const redisLog = React.useCallback(
    (connection: string, command: string, ...args: any[]) => {
      updateGlobalState((draft) => {
        const info = { time: new Date(), connection, command, args };
        draft.appRedisLogs.push(info);
      });
    },
    []
  );

  return {
    globalState,
    updateGlobalState,
    handleError,
    setMessage,
    showMessage,
    closeMessage,
    loadAppSettingsFromDB,
    saveAppSettings,
    redisLog,
  };
};
