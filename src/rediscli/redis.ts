import { createClient } from '../renderer/utils/redis';
import readline from 'node-color-readline';
//import readline from 'readline';
import Bluebird from 'bluebird';
import splitargs from 'splitargs';
import InputBuffer from './buf';
import createExecutor from './executor';
import 'core-js/features/array/flat';
import 'core-js/features/object/entries';
import { SecurityType, Session, Connection } from '@src/types';
import { commandHelps } from './commands';
import chalk from 'chalk';

class PromptResult {}
class ExitResult {
  constructor(public code: number) {
    this.code = code;
  }
}

const __PR__ = new PromptResult();
const __NORMAL_EXIT__ = new ExitResult(0);
const __ABNORMAL_EXIT__ = new ExitResult(-1);

class RedisClient {
  _mode: string;
  _host: string;
  _port: number;
  _redis_client: RedisClient & any;
  rl: any;
  mode: string;
  executor: any;
  constructor(
    host: string,
    port: number,
    auth: string,
    securityType: SecurityType,
    sslPublicKey: string,
    sslPrivateKey: string,
    sslAuthority: string,
    advConnectionTimeout: number,
    advTotalRetryTime: number,
    advMaxAttempts: number
  ) {
    const session = ({
      connection: {
        host,
        port,
        securityType,
        sslPublicKey,
        sslPrivateKey,
        sslAuthority,
        password: auth,
        advConnectionTimeout,
        advTotalRetryTime,
        advMaxAttempts,
      } as Connection,
    } as unknown) as Session;

    this._mode = 'IP/HOST';
    this._host = host;
    this._port = port;

    const initClient = async () => {
      try {
        this._redis_client = await createClient(session, {});
        Bluebird.promisifyAll(this._redis_client);
        this._attachRedisEvent();
        this._initReadline();
        this.attachEvent();
      } catch (err) {
        console.error(err);
      }
    };

    initClient();
  }

  _initReadline() {
    const completer = (line: string) => {
      const completions = commandHelps.map((c) => c[0] as string);
      const hits = completions.filter((c) => c.startsWith(line.toLowerCase()));
      // Show all completions if none found
      return [hits.length ? hits : completions, line];
    };

    const getMatchedCommand = (input: string) => {
      const commands = commandHelps.map((c) => c[0] as string);
      for (const command of commands) {
        const pattern = new RegExp(`^\\s*${command}\\s*`, 'i');
        if (pattern.test(input)) {
          return command;
        }
      }
      return undefined;
    };

    const suggest = (input: string) => {
      if (!input.trim()) return input;
      const matchedCommand = getMatchedCommand(input);
      if (matchedCommand) {
        const commandHelp = commandHelps.find((c) => c[0] === matchedCommand);
        const remainInput = input.substring(matchedCommand.length);
        const inputArray = remainInput.match(/[\w]+/g) || [];

        if (commandHelp) {
          const params = commandHelp[1] as string;
          const paramArray = params.split(',');
          for (let i = 0; i < inputArray.length; i++) {
            paramArray.shift();
          }
          const returnInput = input.endsWith(' ') ? input : `${input} `;
          return `${returnInput}${chalk.grey(paramArray.join('').trim())}`;
        }
      }
      return input;
    };

    const rlOptions = {
      input: process.stdin,
      output: process.stdout,
      completer,
      suggest,
    };
    this.rl = readline.createInterface(rlOptions);
    if (this.mode !== 'UNIXSOCKET') {
      this.rl.setPrompt(`${this._host}:${this._port}> `);
    } else {
      this.rl.setPrompt(`${this._host}> `);
    }
    this.rl.prompt();
  }

  _attachRedisEvent() {
    this._redis_client.on('end', (_err: Error) => {
      // Exit application when Redis session is ended.
      this.next = __NORMAL_EXIT__;
    });

    this._redis_client.on('error', (err: Error) => {
      this.next = chalk.red(`(error) ${err.message}`);

      // Return non-zero value for error.
      this.next = __ABNORMAL_EXIT__;
    });
  }

  execute(commands: string[]) {
    this.executor = createExecutor(this, commands);
    return this.executor.run();
  }

  attachEvent() {
    this.rl
      .on('line', (line: any) => {
        this._handleInput(line);
      })
      .on('close', () => {
        // trigger when `SIGINT` received
        this.next = '\nAbort!';
        this.next = __NORMAL_EXIT__;
      });
  }

  _handleInput(line: any) {
    line = new InputBuffer(line).toString();
    try {
      let command = line.trim();
      if (command === '') {
        this.next = __PR__;
        return;
      }
      let commands = splitargs(command);
      if (commands.length !== 0) {
        // we have commands, so process, otherwise just a new prompt
        let CMD = commands.shift().toLowerCase();
        //`exit` and `clear` are not true commands, just part of REPL
        if (CMD === 'exit') {
          // all connections will be closed after `RedisClient` quit
          // and an `end` event will be emitted to exit process.
          if (this.executor) this.executor.shutdown();
          this._redis_client.quit();
        } else if (CMD === 'clear') {
          this.next = '\x1b[0f'; /* ANSI clear screen code */
          readline.cursorTo(process.stdout, 0, 0);
          readline.clearScreenDown(process.stdout);
          this.next = __PR__;
        } else {
          return this.execute([CMD, ...commands]).then((blocking: any) => {
            if (!blocking) this.next = __PR__;
          });
        }
      }
    } catch (err) {
      this.next = chalk.red(`(error) ${err.message}`);
      this.next = __PR__;
    }
  }

  set next(v: any) {
    if (typeof v === 'string') {
      console.log(v);
    } else if (Array.isArray(v)) {
      console.log(v.join('\n'));
    } else if (v instanceof PromptResult) {
      this.rl.prompt();
    } else if (v instanceof ExitResult) {
      process.exit(v.code);
    }
  }

  get client() {
    return this._redis_client;
  }
}

const _RedisClient = RedisClient;
export { _RedisClient as RedisClient };
const ___PR__ = __PR__;
export { ___PR__ as __PR__ };
