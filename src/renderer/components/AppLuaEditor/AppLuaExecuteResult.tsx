import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/lua/lua';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars';
import {
  makeStyles,
  createStyles,
  Theme,
  InputBase,
  IconButton,
} from '@material-ui/core';
import clsx from 'clsx';
import { ResultOutputType } from '.';
import { AppResizer } from '../AppResizer';
import { UpIcon } from '@src/icons/UpIcon';
import { DownIcon } from '@src/icons/DownIcon';
import { AppTabs } from '../common/AppTabs';
import { AppTab } from '../common/AppTab';
import { AppTabPanel } from '../common/AppTabPane';
import { Settings } from '@src/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appLuaExecuteResultRoot: {
      display: 'flex',
      flexFlow: 'column',
      position: 'relative',
      borderTop: '1px solid #ddd',
    },
    appLuaExecuteResultHeader: {
      display: 'flex',
    },
    appLuaExecuteResultHeaderLeft: {
      display: 'flex',
      flex: 1,
      width: 0,
      alignItems: 'center',
    },
    appLuaExecuteResultTitle: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      fontWeight: 'bold',
    },
    appLuaExecuteResultHeaderRight: {},
    appLuaExecuteResultPanel: {},
    appLuaResultMessage: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      '& .MuiInputBase-input': {
        fontFamily: (props: Settings) => props.editorFont,
        fontSize: (props: Settings) => `${props.editorFontSize}px`,
        overflow: 'auto !important',
        flex: 1,
        padding: theme.spacing(1),
        boxSizing: 'border-box',
      },
    },
    success: {
      color: `${theme.palette.success.main} !important`,
    },
    error: {
      color: `${theme.palette.error.main} !important`,
    },
  })
);

export interface AppLuaExecuteResultProps {
  className?: string;
  size: number;
  openedSize: number;
  closedSize: number;
  onSizeChange: (size: number) => void;
  onAppLuaExecuteResultClose: (tabId: number) => void;
  resultOutputs: ResultOutputType[];
  resultActiveTab: number;
  setResultActiveTab: (tabId: number) => void;
  appSettings: Settings;
}

export const AppLuaExecuteResult = React.memo(
  (props: AppLuaExecuteResultProps) => {
    const {
      className,
      size,
      onSizeChange,
      openedSize,
      closedSize,
      resultOutputs,
      resultActiveTab,
      setResultActiveTab,
      onAppLuaExecuteResultClose,
      appSettings,
    } = props;
    const classes = useStyles(appSettings);

    const handleResultTabChange = (
      _ev: React.ChangeEvent<{}>,
      resultTab: number
    ) => {
      setResultActiveTab(resultTab);
    };

    return (
      <div
        className={clsx(classes.appLuaExecuteResultRoot, className)}
        style={{
          height: size,
        }}
      >
        <div className={classes.appLuaExecuteResultHeader}>
          <div className={classes.appLuaExecuteResultHeaderLeft}>
            <header className={classes.appLuaExecuteResultTitle}>
              Outputs
            </header>
            <AppTabs
              value={resultActiveTab}
              onChange={handleResultTabChange}
              indicatorColor="secondary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {resultOutputs.map((output, index) => (
                <AppTab
                  key={index}
                  label={`Output${output.serialNumber}`}
                  value={index}
                  className={clsx({
                    [classes.success]: output.success,
                    [classes.error]: !output.success,
                  })}
                  onClose={() => onAppLuaExecuteResultClose(index)}
                />
              ))}
            </AppTabs>
          </div>
          <div className={classes.appLuaExecuteResultHeaderRight}>
            {size <= closedSize ? (
              <IconButton onClick={() => onSizeChange(openedSize)}>
                <UpIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => onSizeChange(closedSize)}>
                <DownIcon />
              </IconButton>
            )}
          </div>
        </div>
        {resultOutputs.map((output, index) => (
          <AppTabPanel
            className={classes.appLuaExecuteResultPanel}
            key={index}
            value={index}
            activeValue={resultActiveTab}
          >
            <InputBase
              spellCheck={false}
              fullWidth
              multiline
              className={clsx(classes.appLuaResultMessage, {
                [classes.error]: !output.success,
                //[classes.success]: output.success,
              })}
              value={output.message}
            />
          </AppTabPanel>
        ))}
        <AppResizer
          size={size}
          onSizeChange={(size) => onSizeChange(size)}
          position="top"
          maxSize={600}
          minSize={closedSize}
        />
      </div>
    );
  }
);
