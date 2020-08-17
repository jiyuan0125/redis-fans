import React from 'react';
import { Session } from '@src/types';
import { UseSessionHook } from './useSession';

export interface UseSessionTabHook {
  getSessionTabIndex: (sessionTabId?: string) => number;
  getSessionByTabId: (sessionTabId: string) => Session | undefined;
  sessionTabExists: (sessionTabId: string) => boolean;
  addSessionTab: (session: Session) => void;
  deleteSessionTab: (sessionTabId: string) => void;
  swapSessionTab: (sourceIndex: number, targetIndex: number) => void;
}

export interface UseSessionTabProps {
  useSessionHook: UseSessionHook;
}

export const useSessionTab = (props: UseSessionTabProps) => {
  const { useSessionHook } = props;
  const {
    sessionState,
    setActiveSessionId,
    updateSessionState,
    deleteSession,
  } = useSessionHook;
  const { sessions, activeSessionId, sessionTabs } = sessionState;

  const getSessionTabIndex = React.useCallback(
    (sessionTabId?: string) => sessionTabs.findIndex((s) => s === sessionTabId),
    [sessionTabs]
  );

  const getSessionByTabId = React.useCallback(
    (sessionTabId: string) => sessions.find((s) => s.id === sessionTabId),
    [sessions]
  );

  const activeSessionTabIndex = getSessionTabIndex(activeSessionId);

  const activeSessionTab = sessionTabs.find((s) => s === activeSessionId);

  const sessionTabExists = React.useCallback(
    (sessionTabId: string) => getSessionTabIndex(sessionTabId) > -1,
    [getSessionTabIndex]
  );

  const addSessionTab = React.useCallback(
    (session: Session) => {
      if (!sessionTabExists(session.id)) {
        updateSessionState((state) => {
          state.sessionTabs.push(session.id);
        });
      }
    },
    [sessionTabExists]
  );

  const deleteSessionTab = React.useCallback(
    (sessionTabId: string) => {
      if (activeSessionId === sessionTabId) {
        let nextActiveSessionId = sessionTabs[activeSessionTabIndex + 1];
        if (!nextActiveSessionId) {
          nextActiveSessionId = sessionTabs[activeSessionTabIndex - 1];
        }
        setActiveSessionId(nextActiveSessionId);
      }
      const index = getSessionTabIndex(sessionTabId);

      if (index > -1) {
        updateSessionState((draft) => {
          draft.sessionTabs.splice(index, 1);
        });
        deleteSession({ id: sessionTabId } as Session);
      }
    },
    [sessionTabs, setActiveSessionId, getSessionTabIndex, activeSessionTabIndex]
  );

  const swapSessionTab = React.useCallback(
    (sourceIndex: number, targetIndex: number) => {
      const bigIndex = Math.max(sourceIndex, targetIndex);
      const smallIndex = Math.min(sourceIndex, targetIndex);
      updateSessionState((draft) => {
        const tmp = draft.sessionTabs.splice(bigIndex, 1);
        draft.sessionTabs.splice(smallIndex, 0, tmp[0]);
      });
    },
    []
  );

  return {
    getSessionTabIndex,
    getSessionByTabId,
    activeSessionTab,
    sessionTabExists,
    addSessionTab,
    deleteSessionTab,
    swapSessionTab,
  };
};
