import { Connection, Session, ViewAs, Updater } from '@src/types';
import { v4 as uuidv4 } from 'uuid';
import { SessionState } from '@src/hooks/useSession';
import { getRedisClient } from './redis';
import electron from 'electron';
const { getCurrentWindow } = electron.remote;

export const createSession = (conn: Connection): Session => {
  return {
    id: uuidv4(),
    name: conn.name,
    connection: conn,
    objects: [],
    tabs: [],
    status: 'end',
    progressing: false,
    serverInfo: {},
    serverConfig: {},
    activeDb: '0',
  };
};

export const convertValue = (
  value: string | undefined,
  viewType: ViewAs,
  compact: boolean = false
): any => {
  if (value === undefined) return '';
  switch (viewType) {
    case 'text':
      return value;
    case 'json':
      return convertValueToJson(value, compact);
    case 'binary':
      return convertValueToBinary(value);
  }
};

const convertValueToJson = (value: string, compact: boolean) => {
  try {
    if (compact) {
      return JSON.stringify(JSON.parse(value));
    } else {
      return JSON.stringify(JSON.parse(value), null, 2);
    }
  } catch (e) {
    return value;
  }
};

const convertValueToBinary = (value: string) => {
  const charCodes: number[] = [];
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    charCodes.push(charCode);
  }
  return charCodes.map((cc) => cc.toString(2)).join('');
};

export const resetFormData = (
  formData: Record<string, any>,
  initialValue: Record<string, any>
) => {
  Object.keys(initialValue).forEach((key) => {
    if (initialValue.hasOwnProperty(key)) {
      try {
        formData[key] = initialValue[key];
      } catch (ex) {
        // Ignore
      }
    }
  });
};

export const convertHashToArray = (value: Record<string, any> | undefined) => {
  const res = [] as Record<string, any>[];

  if (!value) return res;
  Object.keys(value).map((key) => {
    const one = {
      key,
      value: value[key],
    };
    res.push(one);
  });

  return res;
};

export const areEqualShallow = (a: object, b: object) => {
  for (var key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }
  for (var key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }
  return true;
};

export const deleteSessionTabOrTab = (
  updateSessionState: Updater<SessionState>
) => {
  updateSessionState((draft) => {
    const targetSession = draft.sessions.find(
      (s) => s.id === draft.activeSessionId
    );
    if (!targetSession) {
      const window = getCurrentWindow();
      if (window) {
        window.close();
      }
      return;
    }

    if (targetSession.tabs.length === 0) {
      // No tabs, should delete session tab
      const activeSessionTabIndex = draft.sessionTabs.findIndex(
        (s) => s === draft.activeSessionId
      );
      let nextActiveSessionId = draft.sessionTabs[activeSessionTabIndex + 1];
      if (!nextActiveSessionId) {
        nextActiveSessionId = draft.sessionTabs[activeSessionTabIndex - 1];
      }
      draft.sessionTabs.splice(activeSessionTabIndex, 1);
      const activeSessionIndex = draft.sessions.findIndex(
        (s) => s.id === draft.activeSessionId
      );

      draft.sessions.splice(activeSessionIndex, 1);

      getRedisClient(targetSession).then((redisClient) => {
        redisClient.deleted = true;
        if (redisClient) {
          redisClient.quit();
        }
      });
      draft.activeSessionId = nextActiveSessionId;
      // Have tabs, delete active tab
    } else {
      const activeTabIndex = targetSession.tabs.findIndex(
        (tab) => tab.id === targetSession.activeTabId
      );
      let nextActiveTab = targetSession.tabs[activeTabIndex! + 1];
      if (!nextActiveTab) {
        nextActiveTab = targetSession.tabs[activeTabIndex! - 1];
      }
      if (nextActiveTab) {
        targetSession.activeTabId = nextActiveTab.id;
      }
      targetSession.tabs.splice(activeTabIndex, 1);
    }
  });
};
