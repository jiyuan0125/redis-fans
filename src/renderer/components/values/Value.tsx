import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Theme,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { ViewAs, Settings, MessageType } from '@src/types';
import { convertValue } from '@src/utils/common';
import { CopyIcon } from '@src/icons/CopyIcon';
import { FullScreenIcon } from '@src/icons/FullScreenIcon';
import { DownloadIcon } from '@src/icons/DownloadIcon';
import electron from 'electron';
import fs from 'fs';
import { SaveIcon } from '@src/icons/SaveIcon';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import clsx from 'clsx';
import { CancelFullScreenIcon } from '@src/icons/CancelFullScreenIcon';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    valueRoot: {
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      '& .CodeMirror': {
        height: '100%',
        width: '100%',
        fontFamily: (props: Settings) => props.editorFont,
        fontSize: (props: Settings) => `${props.editorFontSize}px`,
      },
    },
    valueHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    valueHeaderLeft: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    valueHeaderRight: {
      display: 'flex',
      flexDirection: 'row',
      flex: 2,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    button: {
      marginLeft: theme.spacing(1),
    },
    valueContent: {
      display: 'flex',
      flexGrow: 1,
      minHeight: 100,
    },
    viewAsControl: {
      minWidth: 120,
    },
    inputValue: {
      flex: 1,
      display: 'flex',
      flexFlow: 'column',
      width: 0, // hack
      '& .MuiInputBase-root': {
        display: 'flex',
        flexFlow: 'column',
        flex: 1,
        height: 0, // hack
        alignItems: 'stretch',
        padding: 1,
        cursor: 'inherit',
      },
      '& .MuiInputBase-input': {
        flex: 1,
        overflow: 'auto !important',
      },
    },
    fullScreen: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: 1200,
      background: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
  })
);

interface ValueProps {
  onSaveValue?: () => void;
  onValueChange?: (value: string) => void;
  label: string;
  value: string | undefined;
  appSettings: Settings;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
}

export const Value = React.memo((props: ValueProps) => {
  const [viewType, setViewType] = React.useState<ViewAs>('text');
  const {
    value,
    label,
    onValueChange,
    onSaveValue,
    appSettings,
    showMessage,
  } = props;
  const classes = useStyles(appSettings);

  const valueDOMRef = React.useRef<HTMLDivElement | null>(null);
  const editorRef = React.useRef<CodeMirror.Editor | undefined>(undefined);
  const [innerValue, setInnerValue] = React.useState(
    convertValue(value, viewType)
  );

  const [fullScreen, setFullScreen] = React.useState(false);

  React.useEffect(() => {
    setInnerValue(convertValue(value, viewType));
  }, [value, viewType]);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      if (viewType === 'text' || viewType === 'binary') {
        editor.setOption('readOnly', false);
        editor.setOption('mode', null);
      } else {
        editor.setOption('readOnly', true);
        editor.setOption('mode', 'javascript');
      }
    }
  }, [viewType]);

  React.useEffect(() => {
    const valueDOM = valueDOMRef.current;
    if (valueDOM) {
      editorRef.current = CodeMirror.fromTextArea(
        valueDOM.querySelector('.MuiInputBase-input') as HTMLTextAreaElement,
        {
          mode: null,
          autocorrect: true,
          foldGutter: true,
          gutters: ['CodeMirror-foldgutter'],
          scrollbarStyle: 'simple',
          autoCloseBrackets: true,
          lineWrapping: true,
          value: innerValue,
        }
      );
    }
  }, []);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      const blurHandler = (instance: CodeMirror.Editor) => {
        if (onValueChange) {
          if (viewType === 'text' || viewType === 'json') {
            onValueChange(instance.getValue());
          }
        }
      };
      editor.on('blur', blurHandler);
      return () => {
        editor.off('blur', blurHandler);
      };
    }
  }, [onValueChange, viewType]);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(innerValue || '');
    }
  }, [innerValue]);

  React.useEffect(() => {
    const handleExitFullScreen = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleExitFullScreen);

    return () => {
      document.removeEventListener('keydown', handleExitFullScreen);
    };
  }, [setFullScreen]);

  const browserWindow = electron.remote.getCurrentWindow();
  const dialog = electron.remote.dialog;

  const handleCopyValue = () => {
    const listener = (ev: ClipboardEvent) => {
      ev.preventDefault();
      if (ev.clipboardData) {
        ev.clipboardData.setData('text/plain', convertValue(value, viewType));
      }
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);

    showMessage('success', 'Value copyed to the clipboard.');
  };

  const handleSaveValue = () => {
    if (onSaveValue) {
      if (viewType === 'text' || viewType === 'json') {
        onSaveValue();
      }
    }
  };

  const handleSaveValueToFile = async () => {
    const options = {};
    const result = await dialog.showSaveDialog(browserWindow, options);
    if (result.filePath && value) {
      fs.writeFileSync(result.filePath, value);
    }
  };

  return (
    <div
      className={clsx(classes.valueRoot, { [classes.fullScreen]: fullScreen })}
    >
      <div className={classes.valueHeader}>
        <div className={classes.valueHeaderLeft}>
          <FormControl variant="outlined" className={classes.viewAsControl}>
            <InputLabel>View as</InputLabel>
            <Select
              label="View as"
              value={viewType}
              onChange={(ev: React.ChangeEvent<{ value: unknown }>) =>
                setViewType(ev.target.value as ViewAs)
              }
            >
              <MenuItem key="text" value="text">
                text
              </MenuItem>
              <MenuItem key="json" value="json">
                json
              </MenuItem>
              <MenuItem key="binary" value="binary">
                binary
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={classes.valueHeaderRight}>
          {fullScreen ? (
            <Tooltip title="Cancel Full Screen">
              <IconButton
                onClick={() => setFullScreen(false)}
                className={classes.button}
              >
                <CancelFullScreenIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Full Screen">
              <IconButton
                onClick={() => setFullScreen(true)}
                className={classes.button}
              >
                <FullScreenIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Copy">
            <IconButton onClick={handleCopyValue} className={classes.button}>
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save Value to File">
            <IconButton
              onClick={handleSaveValueToFile}
              className={classes.button}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          {onSaveValue && (
            <Tooltip title="Update Value">
              <IconButton onClick={handleSaveValue} className={classes.button}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
      <div className={classes.valueContent}>
        <TextField
          ref={valueDOMRef}
          spellCheck={false}
          fullWidth
          multiline
          label={label}
          variant="outlined"
          className={classes.inputValue}
          value={innerValue}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </div>
  );
});
