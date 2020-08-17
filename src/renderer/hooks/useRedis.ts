import React from 'react';
import {
  execute,
  parseInfo,
  getRedisClient,
  executeByClient,
} from '@src/utils/redis';
import { DataObject, Session, ObjectDataType } from '@src/types';
import { UseGlobalHook } from '@src/hooks/useGlobal';
import { LIST_TO_DELTE_VALUE } from '@src/constants';
import { UseSessionHook } from './useSession';
import { RedisClient } from 'redis';

export interface RedisResult {
  success: boolean;
  error?: Error;
  result?: any;
}

const success = (result?: any): RedisResult => ({
  success: true,
  result,
});

const error = (error: Error): RedisResult => ({
  success: false,
  error,
});

export interface UseRedisHook {
  redisExecuteLua: (
    lua: string,
    numsOfKey: number,
    ...keyOrArgvs: any[]
  ) => Promise<RedisResult>;
  redisLoadObjects: () => Promise<RedisResult>;
  redisLoadServerConfig: () => Promise<RedisResult>;
  redisRenameObject: (oldKey: string, newKey: string) => Promise<RedisResult>;
  redisLoadServerInfo: () => Promise<RedisResult>;
  redisLoadObjectDetail: (objecdt: DataObject) => Promise<RedisResult>;
  redisExpireObject: (key: string, expire: number) => Promise<RedisResult>;
  redisDeleteObject: (key: string) => Promise<RedisResult>;
  redisUpdateObjectValue: (
    key: string,
    newValue: string
  ) => Promise<RedisResult>;
  redisCreateStringObject: (key: string, value: string) => Promise<RedisResult>;
  redisCreateHashObject: (
    key: string,
    field: string,
    value: string
  ) => Promise<RedisResult>;
  redisCreateListObject: (key: string, value: string) => Promise<RedisResult>;
  redisCreateSetObject: (key: string, value: string) => Promise<RedisResult>;
  redisCreateZsetObject: (
    key: string,
    score: number,
    value: string
  ) => Promise<RedisResult>;
  redisAddHashField: (
    key: string,
    field: string,
    value: string
  ) => Promise<RedisResult>;
  redisUpdateHashField: (
    key: string,
    oldField: string,
    newField: string,
    value: string
  ) => Promise<RedisResult>;
  redisUpdateHashValue: (
    key: string,
    field: string,
    value: string
  ) => Promise<RedisResult>;
  redisDeleteHashField: (key: string, field: string) => Promise<RedisResult>;
  redisAddListValue: (key: string, value: string) => Promise<RedisResult>;
  redisUpdateListValue: (
    key: string,
    index: number,
    value: string
  ) => Promise<RedisResult>;
  redisDeleteListValue: (key: string, index: number) => Promise<RedisResult>;
  redisAddSetValue: (key: string, value: string) => Promise<RedisResult>;
  redisUpdateSetValue: (
    key: string,
    oldValue: string,
    newValue: string
  ) => Promise<RedisResult>;
  redisDeleteSetValue: (key: string, value: string) => Promise<RedisResult>;
  redisAddZsetValue: (
    key: string,
    score: number,
    value: string
  ) => Promise<RedisResult>;
  redisUpdateZsetValue: (
    key: string,
    oldValue: string,
    score: number,
    newValue: string
  ) => Promise<RedisResult>;
  redisDeleteZsetValue: (key: string, value: string) => Promise<RedisResult>;
  redisSelectDb: (db: string) => Promise<RedisResult>;
}

export interface UseRedisProps {
  session: Session;
  useGlobalHook: UseGlobalHook;
  useSessionHook: UseSessionHook;
}

export const useRedis = (props: UseRedisProps) => {
  const { session, useSessionHook, useGlobalHook } = props;
  const connection = session.connection;

  const { redisLog } = useGlobalHook;
  const { setProgressing } = useSessionHook;

  /**
   * redis 执行 lua
   */
  const redisExecuteLua = React.useCallback(
    async (lua: string, numsOfKey: number, ...keyOrArgvs: any[]) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'eval', lua, numsOfKey, ...keyOrArgvs);
        const result = await execute(
          session,
          'eval',
          lua,
          numsOfKey,
          ...keyOrArgvs
        );
        return success(result);
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * 加载keys 信息
   */
  const redisLoadObjects = React.useCallback(async () => {
    const doLoad = async (
      redisClient: RedisClient,
      result: string[] = [],
      nextCursor = 0,
      count = 1000
    ) => {
      let response = await executeByClient(
        redisClient,
        'scan',
        nextCursor,
        'count',
        count
      );

      if (response && response[1]) {
        for (const key of response[1]) {
          result.push(key);
        }
      }

      if (response && parseInt(response[0]) !== 0) {
        return await doLoad(redisClient, result, response[0], count);
      } else {
        return result;
      }
    };

    const redisClient = await getRedisClient(session);
    try {
      setProgressing(session, true);
      const infoClusterResponse = await execute(session, 'info', 'cluster');
      const infoCluster = parseInfo(infoClusterResponse);
      const isCluster = infoCluster['Cluster']['cluster_enabled'] === '1';
      if (isCluster) {
        const connections = redisClient.connections;
        const connKeys = Object.keys(connections);
        const masterClients = connKeys
          .filter((c) => {
            return connections[c].master === true;
          })
          .map((c) => connections[c]);

        const results = await Promise.all(masterClients.map((c) => doLoad(c)));
        return success(results.reduce((a, b) => a.concat(b), []));
      } else {
        return success(await doLoad(await getRedisClient(session)));
      }
    } catch (ex) {
      return error(ex);
    } finally {
      setProgressing(session, false);
    }
  }, [setProgressing, redisLog, redisExecuteLua]);

  /**
   * 加载 Redis 配置信息
   */
  const redisLoadServerConfig = React.useCallback(async () => {
    try {
      redisLog(connection.name, 'config', 'get', '*');
      const config = await execute<string[]>(session, 'config', 'get', '*');
      setProgressing(session, true);
      return success(config);
    } catch (ex) {
      return error(ex);
    } finally {
      setProgressing(session, false);
    }
  }, [redisLog, setProgressing]);

  /**
   * redis 重命名 object
   */
  const redisRenameObject = React.useCallback(
    async (oldKey: string, newKey: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'rename', oldKey, newKey);
        await execute(session, 'rename', oldKey, newKey);
        return success({ redisLoadObjects, redisRenameObject });
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 加载服务器的信息
   */
  const redisLoadServerInfo = React.useCallback(async () => {
    try {
      setProgressing(session, true);
      redisLog(connection.name, 'info', 'all');
      const response = await execute(session, 'info', 'all');
      return success(parseInfo(response));
    } catch (ex) {
      return error(ex);
    } finally {
      setProgressing(session, false);
    }
  }, [setProgressing, redisLog]);

  /**
   * redis 刷新对象信息
   */
  const redisLoadObjectDetail = React.useCallback(
    async (object: DataObject) => {
      const type = await execute(session, 'type', object.key);
      const getValueCommand = (dataType: ObjectDataType, key: string) => {
        switch (dataType) {
          case 'string':
            redisLog(connection.name, 'get', key);
            return execute(session, 'get', key);
          case 'hash':
            redisLog(connection.name, 'hgetall', key);
            return execute(session, 'hgetall', key);
          case 'list':
            redisLog(connection.name, 'lrange', key, 0, -1);
            return execute(session, 'lrange', key, 0, -1);
          case 'set':
            redisLog(connection.name, 'smembers', key);
            return execute(session, 'smembers', key);
          case 'zset':
            redisLog(connection.name, 'zrange', key, 0, -1, 'withscores');
            return execute(session, 'zrange', key, 0, -1, 'withscores');

          default:
            throw new Error('No matched data type');
        }
      };
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'ttl', object.key);
        const [value, expire] = await Promise.all<any, number>([
          getValueCommand(type, object.key),
          execute(session, 'ttl', object.key),
        ]);
        return success({ type, value, expire });
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [redisLog, setProgressing]
  );

  /**
   * redis 设置过期时间
   */
  const redisExpireObject = React.useCallback(
    async (key: string, expire: number) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'expire', key, expire);
        await execute(session, 'expire', key, expire);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, true);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 删除 object
   */
  const redisDeleteObject = React.useCallback(
    async (key: string) => {
      setProgressing(session, true);
      try {
        redisLog(connection.name, 'del', key);
        await execute(session, 'del', key);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 更新 object value
   */
  const redisUpdateObjectValue = React.useCallback(
    async (key: string, newValue: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'set', key, newValue);
        await execute(session, 'set', key, newValue);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 新增 string object
   */
  const redisCreateStringObject = React.useCallback(
    async (key: string, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'set', key, value);
        await execute(session, 'set', key, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 新增 hash object
   */
  const redisCreateHashObject = React.useCallback(
    async (key: string, field: string, value: string) => {
      if (!connection)
        return error(new Error('Connection is null or undefined'));
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'hset', key, field, value);
        await execute(session, 'hset', key, field, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 新增 list object
   */
  const redisCreateListObject = React.useCallback(
    async (key: string, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'rpush', key, value);
        await execute(session, 'rpush', key, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 新增 set object
   */
  const redisCreateSetObject = React.useCallback(
    async (key: string, value: string) => {
      if (!connection)
        return error(new Error('Connection is null or undefined'));
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'sadd', key, value);
        await execute(session, 'sadd', key, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 新增 zset object
   */
  const redisCreateZsetObject = React.useCallback(
    async (key: string, score: number, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'zadd', key, score, value);
        await execute(session, 'zadd', key, score, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 新增 hash field
   */
  const redisAddHashField = React.useCallback(
    async (key: string, field: string, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'hset', key, field, value);
        await execute(session, 'hset', key, field, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 更新 hash field
   */
  const redisUpdateHashField = React.useCallback(
    async (key: string, oldField: string, newField: string, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'hdel', key, oldField);
        await execute(session, 'hdel', key, oldField);
        redisLog(connection.name, 'hset', key, newField, value);
        await execute(session, 'hset', key, newField, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 更新 hash value
   */
  const redisUpdateHashValue = React.useCallback(
    async (key: string, field: string, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'hset', key, field, value);
        await execute(session, 'hset', key, field, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 删除 hash field
   */
  const redisDeleteHashField = React.useCallback(
    async (key: string, field: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'hdel', key, field);
        await execute(session, 'hdel', key, field);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 添加 list value
   */
  const redisAddListValue = React.useCallback(
    async (key: string, value: string) => {
      if (!connection)
        return error(new Error('Connection is null or undefined'));
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'rpush', key, value);
        await execute(session, 'rpush', key, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 更新 list value
   */
  const redisUpdateListValue = React.useCallback(
    async (key: string, index: number, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'lset', key, index, value);
        await execute(session, 'lset', key, index, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 删除 list value
   */
  const redisDeleteListValue = React.useCallback(
    async (key: string, index: number) => {
      if (!connection)
        return error(new Error('Connection is null or undefined'));
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'lset', key, index, LIST_TO_DELTE_VALUE);
        await execute(session, 'lset', key, index, LIST_TO_DELTE_VALUE);
        redisLog(connection.name, 'lrem', key, 0, LIST_TO_DELTE_VALUE);
        await execute(session, 'lrem', key, 0, LIST_TO_DELTE_VALUE);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 新增 set value
   */
  const redisAddSetValue = React.useCallback(
    async (key: string, value: string) => {
      if (!connection)
        return error(new Error('Connection is null or undefined'));
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'sadd', key, value);
        await execute(session, 'sadd', key, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 更新 set value
   */
  const redisUpdateSetValue = React.useCallback(
    async (key: string, oldValue: string, newValue: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'srem', key, oldValue);
        await execute(session, 'srem', key, oldValue);
        redisLog(connection.name, 'sadd', key, newValue);
        await execute(session, 'sadd', key, newValue);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 删除 set value
   */
  const redisDeleteSetValue = React.useCallback(
    async (key: string, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'srem', key, value);
        await execute(session, 'srem', key, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 新增 zset value
   */
  const redisAddZsetValue = React.useCallback(
    async (key: string, score: number, value: string) => {
      if (!connection)
        return error(new Error('Connection is null or undefined'));
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'zadd', key, score, value);
        await execute(session, 'zadd', key, score, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 更新 zset value
   */
  const redisUpdateZsetValue = React.useCallback(
    async (key: string, oldValue: string, score: number, newValue: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'zrem', key, oldValue);
        await execute(session, 'zrem', key, oldValue);
        redisLog(connection.name, 'zadd', key, score, newValue);
        await execute(session, 'zadd', key, score, newValue);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 删除 zset value
   */
  const redisDeleteZsetValue = React.useCallback(
    async (key: string, value: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'zrem', key, value);
        await execute(session, 'zrem', key, value);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  /**
   * redis 选择 db
   */
  const redisSelectDb = React.useCallback(
    async (db: string) => {
      try {
        setProgressing(session, true);
        redisLog(connection.name, 'select', db);
        await execute(session, 'select', db);
        return success();
      } catch (ex) {
        return error(ex);
      } finally {
        setProgressing(session, false);
      }
    },
    [setProgressing, redisLog]
  );

  return {
    redisLoadObjects,
    redisRenameObject,
    redisLoadServerInfo,
    redisLoadServerConfig,
    redisLoadObjectDetail,
    redisExpireObject,
    redisDeleteObject,
    redisUpdateObjectValue,
    redisCreateStringObject,
    redisCreateHashObject,
    redisCreateListObject,
    redisCreateSetObject,
    redisCreateZsetObject,
    redisAddHashField,
    redisUpdateHashField,
    redisUpdateHashValue,
    redisDeleteHashField,
    redisAddListValue,
    redisUpdateListValue,
    redisDeleteListValue,
    redisAddSetValue,
    redisUpdateSetValue,
    redisDeleteSetValue,
    redisAddZsetValue,
    redisUpdateZsetValue,
    redisDeleteZsetValue,
    redisSelectDb,
    redisExecuteLua,
  };
};
