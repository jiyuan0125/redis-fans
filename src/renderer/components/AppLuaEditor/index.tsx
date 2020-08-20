import React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/lua/lua';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import {
  makeStyles,
  createStyles,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@material-ui/core';
import { Settings, Session, MessageType } from '@src/types';
import { ExecuteIcon } from '@src/icons/ExecuteIcon';
//import { StopIcon } from '@src/icons/StopIcon';
import { OpenIcon } from '@src/icons/OpenIcon';
import { SaveIcon } from '@src/icons/SaveIcon';
import electron from 'electron';
import fs from 'fs';
import { AppLuaParameter } from './AppLuaParameter';
import { LeftIcon } from '@src/icons/LeftIcon';
import { AppLuaExecuteResult } from './AppLuaExecuteResult';
import _ from 'lodash';
import { useImmer } from 'use-immer';
import {
  LUA_OUTPUT_NUMS_MAX,
  DIMENSION_LUAEDITOR_OPENED_RESULT_SIZE,
  DIMENSION_LUAEDITOR_CLOSED_RESULT_SIZE,
  DIMENSION_LUAEDITOR_CLOSED_DRAWER_WIDTH,
  DIMENSION_LUAEDITOR_OPENED_DRAWER_WIDTH,
} from '@src/constants';
import { RedisResult } from '@src/hooks/useRedis';

const useStyles = makeStyles(() =>
  createStyles({
    appLuaEditorRoot: {
      //height: '100%',
      display: 'flex',
      flexFlow: 'column nowrap',
      flex: 1,
    },
    appLuaEditorMain: {
      display: 'flex',
      flexFlow: 'column nowrap',
      flex: 1,
    },
    appLuaOperators: {
      display: 'flex',
      position: 'relative',
      height: 42,
      borderBottom: '1px solid #ddd',
    },
    appLuaOperatorsLeft: {
      flex: 1,
    },
    appLuaOperatorsRight: {},
    appLuaEditor: {
      flex: 1,
      height: 0,
      '& .CodeMirror': {
        height: '100%',
        fontFamily: (props: Settings) => props.editorFont,
        fontSize: (props: Settings) => `${props.editorFontSize}px`,
      },
    },
    appLuaProgress: {
      position: 'absolute',
      top: 10,
      left: 7,
    },
  })
);

const options: CodeMirror.EditorConfiguration = {
  mode: 'lua',
  lineNumbers: true,
  autofocus: true,
  autocorrect: true,
  scrollbarStyle: 'simple',
  autoCloseBrackets: true,
};

export interface KeyArgv {
  index: number;
  value: string;
}

export interface ResultOutputType {
  serialNumber: number;
  success: boolean;
  message: string;
}

export interface AppLuaEditorProps {
  session: Session;
  executeLua: (
    lua: string,
    numsOfKey: number,
    ...keyOrArgvs: any[]
  ) => Promise<RedisResult>;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
  appSettings: Settings;
}

export const AppLuaEditor = React.memo((props: AppLuaEditorProps) => {
  const { executeLua, showMessage, appSettings } = props;
  const luaEditorDOMRef = React.useRef<HTMLDivElement>(null);
  const luaEditorRef = React.useRef<CodeMirror.Editor | undefined>();
  const classes = useStyles(appSettings);

  const [resultOutputs, updateResultOutputs] = useImmer<ResultOutputType[]>([]);
  const [outputSerialNumber, setOutputSerialNumber] = React.useState(1);
  const [resultActiveTab, setResultActiveTab] = React.useState<number>(-1);

  const browserWindow = electron.remote.getCurrentWindow();
  const dialog = electron.remote.dialog;

  const [lua, setLua] = React.useState('');
  const [keyIndexes, setKeyIndexes] = React.useState<number[]>([]);
  const [argvIndexes, setArgvIndexs] = React.useState<number[]>([]);

  const [keys, updateKeys] = useImmer<KeyArgv[]>([]);
  const [argvs, updateArgvs] = useImmer<KeyArgv[]>([]);
  const [drawerWidth, setDrawerWidth] = React.useState<number>(
    DIMENSION_LUAEDITOR_OPENED_DRAWER_WIDTH
  );
  const [resultHeight, setResultHeight] = React.useState<number>(
    DIMENSION_LUAEDITOR_CLOSED_RESULT_SIZE
  );

  React.useEffect(() => {
    const existsKeys = keys.map((key) => key.index);
    const keysToAdd = _.difference(keyIndexes, existsKeys);
    const keysToDelete = _.difference(existsKeys, keyIndexes);
    keysToAdd.forEach((keyIndex: number) => {
      updateKeys((draft) => {
        draft.push({
          index: keyIndex,
          value: '',
        });
      });
    });
    keysToDelete.forEach((keyIndex: number) => {
      updateKeys((draft) => {
        const index = draft.findIndex((key) => key.index === keyIndex);
        draft.splice(index, 1);
      });
    });
  }, [keyIndexes]);

  React.useEffect(() => {
    const existsArgvs = argvs.map((argv) => argv.index);
    const argvsToAdd = _.difference(argvIndexes, existsArgvs);
    const argvsToDelete = _.difference(existsArgvs, argvIndexes);
    argvsToAdd.forEach((argvIndex: number) => {
      updateArgvs((draft) => {
        draft.push({
          index: argvIndex,
          value: '',
        });
      });
    });
    argvsToDelete.forEach((argvIndex: number) => {
      updateArgvs((draft) => {
        const index = draft.findIndex((argv) => argv.index === argvIndex);
        draft.splice(index, 1);
      });
    });
  }, [argvIndexes]);

  React.useEffect(() => {
    const luaEditorDOM = luaEditorDOMRef.current;
    if (luaEditorDOM) {
      const editor = (luaEditorRef.current = CodeMirror(luaEditorDOM, options));
      editor.on('change', (instance) => {
        setLua(instance.getValue());
      });
    }
  }, []);

  const parseKeyIndexes = React.useCallback((lua: string) => {
    const pattern = /(?<=KEYS\[)\d+(?=\])/g;
    const matched = lua.match(pattern);
    if (matched && matched.length > 0) {
      matched.sort((a, b) => parseInt(b) - parseInt(a));
      return _.range(1, parseInt(matched[0]) + 1);
    }
    return [];
  }, []);

  const parseArgvIndexes = React.useCallback((lua: string) => {
    const pattern = /(?<=ARGV\[)\d+(?=\])/g;
    const matched = lua.match(pattern);
    if (matched && matched.length > 0) {
      matched.sort((a, b) => parseInt(b) - parseInt(a));
      return _.range(1, parseInt(matched[0]) + 1);
    }
    return [];
  }, []);

  React.useEffect(() => {
    setKeyIndexes(parseKeyIndexes(lua));
    setArgvIndexs(parseArgvIndexes(lua));
  }, [lua, setKeyIndexes, setArgvIndexs, parseKeyIndexes, parseArgvIndexes]);

  const validateKeys = React.useCallback(() => {
    for (let key of keys) {
      if (!key.value.trim()) return false;
    }
    return true;
  }, []);

  const resultOutputsClosed = React.useMemo(
    () => resultHeight <= DIMENSION_LUAEDITOR_CLOSED_RESULT_SIZE,
    [resultHeight]
  );

  const createResultOutput = React.useCallback(
    (redisResult: RedisResult, timeElapsed: number) => {
      return {
        serialNumber: outputSerialNumber,
        success: redisResult.success,
        message: `${
          redisResult.success ? redisResult.result : redisResult.error
        }
-----------------------------------------------------------------
${lua}
${JSON.stringify(keys.map((key) => key.value))}
${JSON.stringify(argvs.map((argv) => argv.value))}
${timeElapsed}ms
`,
      };
    },
    [outputSerialNumber, lua]
  );

  const handleExecute = React.useCallback(async () => {
    if (lua) {
      if (!validateKeys()) {
        showMessage('error', 'Keys should not be empty.');
        return;
      }
      const startDate = new Date();
      const redisResult = await executeLua(
        lua,
        keys.length,
        ...keys.map((key) => key.value),
        ...argvs.map((argv) => argv.value)
      );
      const endDate = new Date();
      const timeElapsed = endDate.getTime() - startDate.getTime();
      updateResultOutputs((draft) => {
        draft.unshift(createResultOutput(redisResult, timeElapsed));
        if (draft.length > LUA_OUTPUT_NUMS_MAX) {
          draft.pop();
        }
        setResultActiveTab(0);
      });
      setOutputSerialNumber(outputSerialNumber + 1);
      if (resultOutputsClosed) {
        setResultHeight(DIMENSION_LUAEDITOR_OPENED_RESULT_SIZE);
      }
    }
  }, [
    lua,
    executeLua,
    keys,
    argvs,
    updateResultOutputs,
    createResultOutput,
    setResultActiveTab,
    setOutputSerialNumber,
    outputSerialNumber,
    resultOutputsClosed,
    setResultHeight,
  ]);

  const handleOpen = React.useCallback(async () => {
    const options = {};
    const result = await dialog.showOpenDialog(browserWindow, options);
    const fileContent = fs.readFileSync(result.filePaths[0]);
    if (luaEditorRef.current) {
      luaEditorRef.current.setValue(fileContent.toString());
    }
  }, []);

  const handleSave = React.useCallback(async () => {
    const options = {};
    const result = await dialog.showSaveDialog(browserWindow, options);
    if (result.filePath) {
      fs.writeFileSync(result.filePath, lua);
    }
  }, []);

  const handleDrawerOpen = React.useCallback(() => {
    setDrawerWidth(DIMENSION_LUAEDITOR_OPENED_DRAWER_WIDTH);
  }, [setDrawerWidth]);

  const handleDrawerClose = React.useCallback(() => {
    setDrawerWidth(DIMENSION_LUAEDITOR_CLOSED_DRAWER_WIDTH);
  }, [setDrawerWidth]);

  const handleKeyChange = React.useCallback(
    (index: number, value: string) => {
      updateKeys((draft) => {
        const targetKey = draft.find((key) => key.index === index);
        if (targetKey) {
          targetKey.value = value;
        }
      });
    },
    [updateKeys]
  );

  const handleArgvChange = React.useCallback(
    (index: number, value: string) => {
      updateArgvs((draft) => {
        const targetArgv = draft.find((argv) => argv.index === index);
        if (targetArgv) {
          targetArgv.value = value;
        }
      });
    },
    [updateArgvs]
  );

  const handleAppLuaExecuteResultClose = React.useCallback(
    (tabId: number) => {
      updateResultOutputs((draft) => {
        draft.splice(tabId, 1);
      });
    },
    [updateResultOutputs]
  );

  const onSizeChange = React.useCallback(
    (size: number) => setResultHeight(size),
    [setResultHeight]
  );

  return (
    <div className={classes.appLuaEditorRoot}>
      <div
        className={classes.appLuaEditorMain}
        style={{
          marginRight: drawerWidth,
        }}
      >
        <div className={classes.appLuaOperators}>
          <div className={classes.appLuaOperatorsLeft}>
            <Tooltip title="Execute">
              <IconButton
                onClick={handleExecute}
                disabled={props.session.progressing}
              >
                <ExecuteIcon />
                {props.session.progressing && (
                  <CircularProgress
                    size={20}
                    className={classes.appLuaProgress}
                  />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Open File">
              <IconButton onClick={handleOpen}>
                <OpenIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton onClick={handleSave}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.appLuaOperatorsRight}>
            {drawerWidth <= DIMENSION_LUAEDITOR_CLOSED_DRAWER_WIDTH && (
              <IconButton onClick={handleDrawerOpen}>
                <LeftIcon />
              </IconButton>
            )}
          </div>
        </div>
        <div ref={luaEditorDOMRef} className={classes.appLuaEditor} />
        <AppLuaExecuteResult
          size={resultHeight}
          onSizeChange={onSizeChange}
          closedSize={DIMENSION_LUAEDITOR_CLOSED_RESULT_SIZE}
          openedSize={DIMENSION_LUAEDITOR_OPENED_RESULT_SIZE}
          onAppLuaExecuteResultClose={handleAppLuaExecuteResultClose}
          resultOutputs={resultOutputs}
          resultActiveTab={resultActiveTab}
          setResultActiveTab={setResultActiveTab}
          appSettings={appSettings}
        />
      </div>
      <AppLuaParameter
        drawerWidth={drawerWidth}
        onDrawerWidthChange={(size) => setDrawerWidth(size)}
        onDrawerClose={handleDrawerClose}
        keys={keys}
        argvs={argvs}
        onKeyChange={handleKeyChange}
        onArgvChange={handleArgvChange}
        appSettings={appSettings}
      />
    </div>
  );
});
