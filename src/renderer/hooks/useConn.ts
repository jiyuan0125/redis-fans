import React from 'react';
import { createSession } from '@src/utils/common';
import { UseSessionTabHook } from '@src/hooks/useSessionTab';
import { Connection, Updater } from '@src/types';
import { createClient, verifyConnection } from '@src/utils/redis';
import db from '@src/utils/db';
import { useImmer } from 'use-immer';
import { UseSessionHook } from './useSession';
import { UseGlobalHook } from './useGlobal';
import { RedisClient } from 'redis';

const initialValue = {
  connections: [] as Connection[],
};

export type ConnState = typeof initialValue;

export interface UserConnHook {
  connState: ConnState;
  updateConnState: Updater<ConnState>;
  getConnectionIndex: (connectionId: string) => void;
  loadConnectionsFromDB: () => void;
  saveConnection: (connParam: Connection) => void;
  verifyConnection: (connParam: Connection) => Promise<boolean>;
  deleteConnection: (connectionId: string) => void;
}

export interface UseConnProps {
  useGlobalHook: UseGlobalHook;
  useSessionHook: UseSessionHook;
  useSessionTabHook: UseSessionTabHook;
}

export const useConn = (props: UseConnProps) => {
  const [connState, updateConnState] = useImmer(initialValue);
  const { useGlobalHook, useSessionHook, useSessionTabHook } = props;
  const { handleError, showMessage } = useGlobalHook;
  const {
    addSession,
    setActiveSessionId,
    setSessionStatus,
    setProgressing,
  } = useSessionHook;
  const { addSessionTab } = useSessionTabHook;

  const connections = connState.connections;

  const getConnectionIndex = React.useCallback(
    (connectionId: string) => {
      return connections.findIndex(
        (connection) => connection.id === connectionId
      );
    },
    [connections]
  );

  const loadConnectionsFromDB = React.useCallback(async () => {
    const connectionsFromDB = await db.connections.toArray();
    updateConnState((draft) => {
      connectionsFromDB
        .sort((a, b) => a.id.localeCompare(b.id))
        .forEach((c) => {
          draft.connections.push(c);
        });
    });
  }, []);

  const saveConnection = React.useCallback(
    (connParam: Connection) => {
      const index = getConnectionIndex(connParam.id);
      updateConnState((draft) => {
        if (index > -1) {
          draft.connections[index] = connParam;
          db.connections.put(connParam);
        } else {
          const connectionToSave = { ...connParam, id: connParam.name };
          draft.connections.push(connectionToSave);
          db.connections.add(connectionToSave);
        }
      });
    },
    [getConnectionIndex]
  );

  const testConnection = React.useCallback(async (connParam: Connection) => {
    if (await verifyConnection(connParam)) {
      showMessage('success', 'Connected successfully');
    } else {
      showMessage('error', 'Could not connect to the server.');
    }
  }, []);

  const deleteConnection = React.useCallback((connectionId: string) => {
    db.connections.delete(connectionId);
    updateConnState((draft) => {
      const index = draft.connections.findIndex((c) => c.id === connectionId);
      if (index > -1) {
        draft.connections.splice(index, 1);
      }
    });
  }, []);

  /**
   * 连接 redis
   * @param connection redis 连接信息
   */
  const connect = React.useCallback(
    (connection: Connection) => {
      const session = createSession(connection);

      const createClientOptions = {
        onError: (error: Error, client?: RedisClient & any) => {
          setTimeout(() => {
            if (client && client.deleted === true) {
              return;
            }
            handleError(error);
          });
        },
        onConnect: () => {
          setSessionStatus(session, 'connect');
        },
        onReconnecting: () => {
          setSessionStatus(session, 'reconnecting');
        },
        onReady: () => {
          setSessionStatus(session, 'ready');
        },
        onEnd: () => {
          setSessionStatus(session, 'end');
        },
        onWarning: () => {},
        callback: () => {
          addSession(session);
          addSessionTab(session);
          setActiveSessionId(session.id);
        },
      };

      createClient(session, createClientOptions);
    },
    [
      addSession,
      addSessionTab,
      setActiveSessionId,
      setProgressing,
      setSessionStatus,
    ]
  );

  return {
    connState,
    updateConnState,
    loadConnectionsFromDB,
    deleteConnection,
    connect,
    saveConnection,
    testConnection,
  };
};
