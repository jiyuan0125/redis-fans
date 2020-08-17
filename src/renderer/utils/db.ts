import Dexie from 'dexie';
import { INDEXED_DB_NAME, INDEXED_DB_VERSION } from '@src/constants';
import { Connection, Settings } from '@src/types';

class RedisFansDB extends Dexie {
  connections: Dexie.Table<Connection, string>;
  settings: Dexie.Table<Settings, string>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(INDEXED_DB_VERSION).stores({
      connections: `id`,
      settings: `id`,
    });
    this.connections = this.table('connections');
    this.settings = this.table('settings');
  }
}

const db = new RedisFansDB(INDEXED_DB_NAME);
db.version(INDEXED_DB_VERSION).stores({});

export default db;
