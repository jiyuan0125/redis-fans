import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/lua/lua';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars';
import {
  makeStyles,
  createStyles,
  Drawer,
  Theme,
  IconButton,
  Divider,
  TextField,
} from '@material-ui/core';
import { RightIcon } from '@src/icons/RightIcon';
import { KeyArgv } from '.';
import { Settings } from '@src/types';
import { AppResizer } from '../AppResizer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appLuaParameterRoot: {
      display: 'flex',
      flexFlow: 'column nowrap',
      position: 'relative',
    },
    appLuaDrawerPaper: {
      width: (props: AppLuaParameterProps) => props.drawerWidth,
      paddingTop: 74,
      paddingBottom: 25,
      zIndex: 1099,
      overflow: 'visible',
    },
    appLuaDrawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      justifyContent: 'flex-start',
    },
    appLuaDrawerMain: {
      boxSizing: 'border-box',
      padding: theme.spacing(1),
      overflow: 'auto',
    },
    input: {
      '& .MuiInputBase-input': {
        fontFamily: (props: Settings) => props.editorFont,
        fontSize: (props: Settings) => `${props.editorFontSize}px`,
      },
    },
  })
);

export interface AppLuaParameterProps {
  drawerWidth: number;
  onDrawerWidthChange: (size: number) => void;
  onDrawerClose: () => void;
  keys: KeyArgv[];
  argvs: KeyArgv[];
  onKeyChange: (index: number, value: string) => void;
  onArgvChange: (index: number, value: string) => void;
  appSettings: Settings;
}

export const AppLuaParameter = React.memo((props: AppLuaParameterProps) => {
  const {
    onDrawerClose,
    keys,
    argvs,
    onKeyChange,
    onArgvChange,
    onDrawerWidthChange,
    drawerWidth,
    appSettings,
  } = props;

  const classes = useStyles({ ...props, ...appSettings });

  return (
    <Drawer
      className={classes.appLuaParameterRoot}
      variant="persistent"
      anchor="right"
      open={true}
      classes={{
        paper: classes.appLuaDrawerPaper,
      }}
    >
      <div className={classes.appLuaDrawerHeader}>
        <IconButton onClick={onDrawerClose}>
          <RightIcon />
        </IconButton>
        <header>Keys & Argvs</header>
      </div>
      <Divider />
      <div className={classes.appLuaDrawerMain}>
        {keys.map((key) => (
          <div key={key.index}>
            <TextField
              spellCheck={false}
              className={classes.input}
              fullWidth
              variant="outlined"
              label={`KEY[${key.index}]`}
              value={key.value}
              onChange={(ev: React.ChangeEvent<{ value: string }>) =>
                onKeyChange(key.index, ev.target.value)
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        ))}
        {argvs.map((argv) => (
          <div key={argv.index}>
            <TextField
              spellCheck={false}
              className={classes.input}
              fullWidth
              variant="outlined"
              label={`ARGV[${argv.index}]`}
              value={argv.value}
              onChange={(ev: React.ChangeEvent<{ value: string }>) =>
                onArgvChange(argv.index, ev.target.value)
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        ))}
      </div>
      <AppResizer
        size={drawerWidth}
        onSizeChange={(size) => onDrawerWidthChange(size)}
        position="left"
        minSize={200}
        maxSize={600}
      />
    </Drawer>
  );
});
