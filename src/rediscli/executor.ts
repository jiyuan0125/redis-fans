import util from 'util';
import { RedisClient } from 'redis';
import chalk from 'chalk';

const INT_PREFIX = '(integer)';
const BLOCKING_CMDS = ['subscribe', 'monitor', 'psubscribe'];

class Executor {
  _client: any;
  commands: any;
  blockingMode: boolean;
  _executor: any;
  constructor(client: RedisClient, commands: any) {
    this._client = client;
    this.commands = commands;

    const command = this.commands.shift();
    if (command) {
      const CMD = command.toLowerCase();
      this.blockingMode = BLOCKING_CMDS.includes(CMD);
      this._executor = this._client.client[`${CMD}Async`];
      if (typeof this._executor !== 'function') {
        this._executor = this._client.client[`send_commandAsync`];
        // recombine commands
        this.commands = [CMD, this.commands];
      }
    }
  }

  writeResult(result: any) {
    if (Array.isArray(result)) {
      this._client.next = result.map((item, index) => {
        return util.format('%d) %s', index + 1, item);
      });
    } else if (result === null) {
      this._client.next = '(nil)';
    } else if (typeof result === 'object') {
      this._client.next = (Object.entries(result) as any)
        .flat()
        .map((item: any, index: any) => {
          return util.format('%d) %s', index + 1, item);
        });
    } else {
      // number or string
      // default to print it as `string`
      this._client.next = util.format(
        Number.isInteger(result) ? `${INT_PREFIX} ${result}` : result
      );
    }
  }

  run() {
    return this._executor
      .bind(this._client.client)(...this.commands)
      .then((result: any) => {
        this.writeResult(result);
        return this.blockingMode;
      })
      .catch((e: Error) => {
        this._client.next = chalk.red(`(error) ${e.message}`);
      });
  }

  shutdown() {
    // do nothing
  }
}

class SubscribeExecutor extends Executor {
  constructor(client: RedisClient, commands: string[]) {
    super(client, commands);
  }

  run() {
    this._client.client.on('subscribe', (_channel: any, _count: any) => {});

    this._client.client.on('message', (_channel: any, message: any) => {
      this.writeResult(message);
    });
    return super.run();
  }

  shutdown() {
    this._client.client.unsubscribe();
  }
}

class PatternSubscribeExecutor extends SubscribeExecutor {
  constructor(client: any, commands: any) {
    super(client, commands);
  }

  run() {
    this._client.client.on('psubscribe', (_pattern: any, _count: any) => {});

    this._client.client.on(
      'pmessage',
      (_pattern: any, _channel: any, message: any) => {
        this.writeResult(message);
      }
    );
    return super.run();
  }
}

class MonitorExecutor extends Executor {
  constructor(client: RedisClient, commands: string[]) {
    super(client, commands);
  }

  run() {
    this._client.client.on(
      'monitor',
      (_time: any, _args: any, raw_reply: any) => {
        this.writeResult(raw_reply);
      }
    );
    return super.run();
  }
}

export default function (client: any, commands: string[]) {
  const CMD = commands[0].toLowerCase();
  if (CMD === 'subscribe') {
    return new SubscribeExecutor(client, commands);
  } else if (CMD === 'psubscribe') {
    return new PatternSubscribeExecutor(client, commands);
  } else if (CMD === 'monitor') {
    return new MonitorExecutor(client, commands);
  } else {
    return new Executor(client, commands);
  }
}
