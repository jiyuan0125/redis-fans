import React from 'react';
import { Session, Updater, SessionStatus } from '@src/types';
import { useImmer } from 'use-immer';
import { getRedisClient } from '@src/utils/redis';

const initialValue = {
  activeSessionId: undefined as string | undefined,
  sessionTabs: [] as string[],
  sessions: [] as Session[],
};

export type SessionState = typeof initialValue;

export interface UseSessionHook {
  sessionState: SessionState;
  updateSessionState: Updater<SessionState>;
  setActiveSessionId: (sessionId: string) => void;
  getSessionIndex: (sessionId: string) => void;
  sessionExists: (sessionId: string) => void;
  addSession: (session: Session) => void;
  deleteSession: (session: Session) => void;
  setSessionStatus: (session: Session, status: SessionStatus) => void;
  setProgressing: (session: Session, progressing: boolean) => void;
}

export const useSession = () => {
  const [sessionState, updateSessionState] = useImmer(initialValue);
  const { activeSessionId, sessions } = sessionState;

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const setActiveSessionId = React.useCallback((sessionId: string) => {
    updateSessionState((draft) => {
      draft.activeSessionId = sessionId;
    });
  }, []);

  const getSessionIndex = React.useCallback(
    (sessionId: string) => {
      return sessionState.sessions.findIndex((s) => s.id === sessionId);
    },
    [sessionState.sessions]
  );

  const sessionExists = React.useCallback(
    (sessionId: string) => {
      return getSessionIndex(sessionId) > -1;
    },
    [getSessionIndex]
  );

  const addSession = React.useCallback(
    (session: Session) => {
      updateSessionState((draft) => {
        if (!sessionExists(session.id)) {
          draft.sessions.push(session);
        }
      });
    },
    [sessionExists]
  );

  const setSessionStatus = React.useCallback(
    (session: Session, status: SessionStatus) => {
      updateSessionState((draft) => {
        const targetSession = draft.sessions.find((s) => s.id === session.id);
        if (!targetSession) return;
        targetSession.status = status;
      });
    },
    []
  );

  const setProgressing = React.useCallback(
    (session: Session, progressing: boolean) => {
      updateSessionState((draft) => {
        const targetSession = draft.sessions.find((s) => s.id === session.id);
        if (!targetSession) return;
        targetSession.progressing = progressing;
      });
    },
    []
  );

  const deleteSession = React.useCallback(async (session: Session) => {
    const index = getSessionIndex(session.id);
    if (index > -1) {
      updateSessionState((draft) => {
        draft.sessions.splice(index, 1);
      });
    }
    const redisClient = await getRedisClient(session);
    if (redisClient) {
      redisClient.deleted = true;
      redisClient.quit();
    }
  }, []);

  return {
    sessionState,
    updateSessionState,
    activeSession,
    setActiveSessionId,
    getSessionIndex,
    sessionExists,
    addSession,
    deleteSession,
    setSessionStatus,
    setProgressing,
  };
};
