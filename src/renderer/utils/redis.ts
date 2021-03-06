import Redis, {
  RedisClient,
  Commands,
  RetryStrategyOptions,
  ClientOpts,
} from 'redis';
import RedisClustr from '../lib/redis-clustr/RedisClustr';
import { Session, Connection } from '@src/types';
import fs from 'fs';

interface CachedRedisClient {
  [key: string]: RedisClient & any;
}

const cachedRedisClient: CachedRedisClient = {};
export type Execute = typeof execute;

export const execute = async <R = any>(
  session: Session,
  command: keyof Commands<R>,
  ...args: any[]
): Promise<R> => {
  const redisClient = await getRedisClient(session);

  return executeByClient(redisClient, command, ...args);
};

export const executeByClient = async <R = any>(
  redisClient: RedisClient,
  command: keyof Commands<R>,
  ...args: any[]
): Promise<R> => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`redis execute`);
    console.debug(`------------------`);
    console.debug(`connection: ${redisClient}`);
    console.debug(`command: ${command}`);
    console.debug(`args: ${args}`);
    console.debug(`------------------`);
  }

  return new Promise<R>((resolve, reject) => {
    (redisClient[command] as Function)(
      ...args,
      (err: Error | null, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res as R);
        }
      }
    );
  });
};

export const getRedisClient = async (session: Session) => {
  return await cachedRedisClient[session.id];
};

export interface CreateClientOptions {
  onError?: (error: Error, client?: RedisClient) => void;
  onReady?: (client: RedisClient) => void;
  onConnect?: (client: RedisClient) => void;
  onReconnecting?: (client: RedisClient) => void;
  onEnd?: (client: RedisClient) => void;
  onWarning?: (client: RedisClient) => void;
  //callback?: (client: RedisClient) => void;
}

export const createClient = (
  session: Session,
  createClientOptions: CreateClientOptions
): Promise<RedisClient & any> => {
  const {
    host,
    port,
    securityType,
    sslPublicKey,
    sslPrivateKey,
    sslAuthority,
    sslEnableStrictMode,
    password,
    advConnectionTimeout,
    advTotalRetryTime,
    advMaxAttempts,
  } = session.connection;

  const options: ClientOpts = {
    host,
    port,
    connect_timeout: advConnectionTimeout * 1000,
    retry_strategy: function (options: RetryStrategyOptions) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        const error = new Error('The server refused the connection');
        if (createClientOptions.onError) {
          createClientOptions.onError(error);
        }
        return undefined;
      }
      if (options.total_retry_time > 1000 * advTotalRetryTime) {
        const error = new Error('Retry time exhausted');
        if (createClientOptions.onError) {
          createClientOptions.onError(error);
        }
        return undefined;
      }
      if (options.attempt > advMaxAttempts) {
        const error = new Error('Max Attempts exhausted');
        if (createClientOptions.onError) {
          createClientOptions.onError(error);
        }
        return undefined;
      }
      return Math.min(options.attempt * 100, 3000);
    },
  };

  if (securityType === 'SSL/TSL') {
    options.tls = {
      key: fs.readFileSync(sslPrivateKey),
      cert: fs.readFileSync(sslPublicKey),
      ca: [fs.readFileSync(sslAuthority)],
    };
    if (!sslEnableStrictMode) {
      options.tls.checkServerIdentity = () => null;
    }
  }

  const registerListeners = (client: RedisClient | any) => {
    //if (createClientOptions.callback) {
    //createClientOptions.callback(client);
    //}

    client.on('error', (error: Error) => {
      if (createClientOptions.onError) {
        createClientOptions.onError(error, client);
      }
    });

    client.on('ready', () => {
      if (createClientOptions.onReady) {
        createClientOptions.onReady(client);
      }
    });

    client.on('connect', () => {
      if (createClientOptions.onConnect) {
        createClientOptions.onConnect(client);
      }
    });

    client.on('reconnecting', () => {
      if (createClientOptions.onReconnecting) {
        createClientOptions.onReconnecting(client);
      }
    });

    client.on('end', () => {
      if (createClientOptions.onEnd) {
        createClientOptions.onEnd(client);
      }
    });

    client.on('warning', () => {
      if (createClientOptions.onWarning) {
        createClientOptions.onWarning(client);
      }
    });
  };

  const redisClient = Redis.createClient(options);
  registerListeners(redisClient);
  if (password) {
    redisClient.auth(password);
  }

  const clientPromise: Promise<RedisClient & any> = new Promise<
    RedisClient & any
  >((resolve) => {
    redisClient.sendCommand('cluster', ['info'], (err: Error | null) => {
      if (!err) {
        redisClient.quit();
        const redisClustr = new RedisClustr({
          servers: [{ host, port }],
          createClient: (port: number, host: string) =>
            Redis.createClient(port, host, { ...options, password }),
        });
        cachedRedisClient[session.id] = redisClustr;
        registerListeners(redisClustr);
        resolve(redisClustr);
      } else {
        cachedRedisClient[session.id] = redisClient;
        resolve(redisClient);
      }
    });
  });

  cachedRedisClient[session.id] = clientPromise;

  return clientPromise;
};

export const parseInfo = (infoStr: string) => {
  const result = {};
  const pattern = /(?<=^# )\w+$/gm;

  const segments = infoStr.match(pattern) || [];
  segments.forEach((key) => (result[key] = {}));

  for (let i = 0; i < segments.length; i++) {
    const begin = segments[i];
    const end = segments[i + 1];

    const p = end
      ? new RegExp(`(?<=# ${begin}\\s*)(.|\\s)*?(?=\\s*# ${end})`)
      : new RegExp(`(?<=# ${begin}\\s*)(.|\\s)*?(?=\\s*$)`);

    const execResult = p.exec(infoStr);
    if (execResult) {
      const segmentContent = execResult[0];
      segmentContent.split(/\n/).forEach((line) => {
        if (line && line.trim().length > 0) {
          const key = line.split(':')[0];
          const values = line.split(':')[1];
          const keyValuePairs = values.split(',');
          if (keyValuePairs.length > 1) {
            const keyValues = {};
            keyValuePairs.forEach((keyValuePair) => {
              const keyValuePairSplit = keyValuePair.split('=');
              keyValues[keyValuePairSplit[0]] = keyValuePairSplit[1];
            });
            result[begin][key] = keyValues;
          } else {
            result[begin][key] = values[0];
          }
        }
      });
    }
  }
  return result;
};

export const verifyConnection = async (connection: Connection) => {
  const {
    host,
    port,
    securityType,
    sslPublicKey,
    sslPrivateKey,
    sslAuthority,
    sslEnableStrictMode,
    advConnectionTimeout,
    password,
  } = connection;

  const options: ClientOpts = {
    host,
    port,
    connect_timeout: advConnectionTimeout * 1000,
    retry_strategy: function (options: RetryStrategyOptions) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('The server refused the connection');
      }
      if (options.attempt > 0) {
        return new Error('Could not connect to the server');
      }
    },
  };

  if (securityType === 'SSL/TSL') {
    options.tls = {
      key: fs.readFileSync(sslPrivateKey),
      cert: fs.readFileSync(sslPublicKey),
      ca: [fs.readFileSync(sslAuthority)],
    };
    if (!sslEnableStrictMode) {
      options.tls.checkServerIdentity = () => null;
    }
  }

  const redisClient = Redis.createClient(options);
  if (password) {
    redisClient.auth(password);
  }

  return new Promise<RedisClient & any>((resolve) => {
    redisClient.on('connect', () => {
      resolve(true);
    });
    redisClient.on('error', () => {
      resolve(false);
    });
  });
};

export const getTrulyRedisClients = async (session: Session) => {
  const redisClient = await getRedisClient(session);
  const trulyRedisClients: (RedisClient & any)[] = [];
  const isCluster = redisClient instanceof RedisClustr;
  if (isCluster) {
    const connections = redisClient.connections;
    const connKeys = Object.keys(connections);
    connKeys
      .filter((c) => {
        return connections[c].master === true;
      })
      .map((c) => connections[c])
      .forEach((rc) => {
        trulyRedisClients.push(rc);
      });
  } else {
    trulyRedisClients.push(redisClient);
  }
  return trulyRedisClients;
};

export const cachedScanIterators: {
  [key: string]: AsyncGenerator;
} = {};

export const scanGenerator = async function* (
  session: Session,
  match: string,
  count: number
) {
  const trulyRedisClients = await getTrulyRedisClients(session);
  let currentClientIndexInUse = 0;
  let redisClient = trulyRedisClients[currentClientIndexInUse];
  let cursor = 0;
  let result: string[] = [];

  while (true) {
    const response = await executeByClient(
      redisClient,
      'scan',
      cursor,
      'match',
      match,
      'count',
      count
    );

    cursor = parseInt(response[0]);
    result = result.concat(response[1]);
    if (cursor === 0) {
      currentClientIndexInUse++;
      redisClient = trulyRedisClients[currentClientIndexInUse];
    }

    if (cursor === 0 && currentClientIndexInUse === trulyRedisClients.length) {
      return result;
    } else {
      if (result.length < count) {
        continue;
      }
      yield result;
      result = [];
    }
  }
};
