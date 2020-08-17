import React from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import { remote } from 'electron';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { makeStyles, createStyles } from '@material-ui/core';
import _ from 'lodash';
import path from 'path';
import electron from 'electron';

import { Session, Settings } from '@src/types';

const pty = remote.require('node-pty');
var basepath = remote.app.getAppPath();

const useStyles = makeStyles(() =>
  createStyles({
    appTermRoot: {
      height: '100%',
      '& .terminal': {
        height: '100%',
      },
    },
  })
);

const getTerminalOption: { (props: Settings): ITerminalOptions } = (props) => ({
  disableStdin: false,
  cursorBlink: true,
  fontFamily: props.editorFont,
  fontSize: props.editorFontSize,
  windowOptions: {
    setWinSizePixels: true,
  },
});

export interface AppTerminalProps {
  session: Session;
  appSettings: Settings;
}

export const AppTerminal = React.memo((props: AppTerminalProps) => {
  const { session, appSettings } = props;
  const [theme, setTheme] = React.useState();
  const classes = useStyles(appSettings);
  const xtermRef = React.useRef<Terminal | undefined>();
  const xtermDOMRef = React.useRef<HTMLDivElement | null>(null);

  import(`./themes/${appSettings.terminalTheme}`).then(({ theme }) => {
    setTheme(theme);
  });

  React.useEffect(() => {
    const xterm = xtermRef.current;
    if (xterm) {
      xterm.focus();
    }
  });

  React.useEffect(() => {
    const xterm = xtermRef.current;
    if (xterm) {
      xterm.setOption('theme', theme);
    }
  }, [theme]);

  React.useEffect(() => {
    const xtermDOM = xtermDOMRef.current;
    if (!xtermDOM) return;
    const xterm = (xtermRef.current = new Terminal(
      getTerminalOption(appSettings)
    ));

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(xtermDOM);
    xterm.focus();
    fitAddon.fit();

    xterm.onData((data) => {
      ptyProcess.write(data);
    });

    const conn = session.connection;

    const cmd = '/usr/local/bin/node';
    let script: string | undefined = undefined;
    if (process.env.NODE_ENV === 'development') {
      script = path.resolve('build/rediscli/rediscli.bundle.js');
    } else {
      script = path.resolve(basepath, 'rediscli.bundle.js');
    }
    const ptyProcess = pty.spawn(
      cmd,
      [
        script,
        '--host',
        conn.host,
        '--port',
        conn.port,
        '--auth',
        conn.password,
        '--security-type',
        conn.securityType,
        '--ssl-public-key',
        conn.sslPublicKey,
        '--ssl-private-key',
        conn.sslPrivateKey,
        '--ssl-authority',
        conn.sslAuthority,
        '--ssl-enable-strict-mode',
        conn.sslEnableStrictMode,
        '--adv-connection-timeout',
        conn.advConnectionTimeout,
        '--adv-total-retry-time',
        conn.advTotalRetryTime,
        '--adv-max-attempts',
        conn.advMaxAttempts,
      ],
      {
        env: electron.remote.process.env,
      }
    );
    ptyProcess.on('data', (data: string) => {
      xterm.write(data);
    });

    const handleResize = _.debounce(() => {
      fitAddon.fit();
    }, 150);

    const resizeObserver = new window.ResizeObserver(handleResize);
    resizeObserver.observe(xtermDOM);

    return () => {
      ptyProcess.kill();
      xterm.dispose();
      resizeObserver.unobserve(xtermDOM);
    };
  }, []);

  React.useEffect(() => {
    const xterm = xtermRef.current;
    if (xterm) {
      xterm.setOption('fontFamily', appSettings.terminalFont);
      xterm.setOption('fontSize', appSettings.terminalFontSize);
    }
  }, [appSettings]);

  return <div ref={xtermDOMRef} className={classes.appTermRoot} />;
});
