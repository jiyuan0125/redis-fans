import React from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StringValue } from '@src/components/values/StringValue';
import { HashValue } from '@src/components/values/HashValue';
import { ListValue } from '@src/components/values/ListValue';
import { SetValue } from '@src/components/values/SetValue';
import { ZsetValue } from '@src/components/values/ZsetValue';
import { DataObject, Settings, MessageType } from '@src/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appObjectValueRoot: {
      display: 'flex',
      flexFlow: 'column',
      flex: 1,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
  })
);

export interface AppObjectValueProps {
  object: DataObject;
  updateObjectValue: (object: DataObject, value: string) => void;
  addHashField: (object: DataObject, field: string, value: string) => void;
  updateHashField: (
    object: DataObject,
    oldField: string,
    newField: string,
    value: string
  ) => void;
  updateHashValue: (object: DataObject, field: string, value: string) => void;
  deleteHashField: (object: DataObject, field: string) => void;
  addListValue: (object: DataObject, value: string) => void;
  updateListValue: (object: DataObject, index: number, value: string) => void;
  deleteListValue: (object: DataObject, index: number) => void;
  addSetValue: (object: DataObject, value: string) => void;
  updateSetValue: (
    object: DataObject,
    oldValue: string,
    newValue: string
  ) => void;
  deleteSetValue: (object: DataObject, value: string) => void;
  addZsetValue: (object: DataObject, score: number, value: string) => void;
  updateZsetValue: (
    object: DataObject,
    oldValue: string,
    score: number,
    newValue: string
  ) => void;
  deleteZsetValue: (object: DataObject, value: string) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
}

export const AppObjectValue = React.memo((props: AppObjectValueProps) => {
  const classes = useStyles();
  const {
    object,
    updateObjectValue,
    addHashField,
    updateHashField,
    updateHashValue,
    deleteHashField,
    addListValue,
    updateListValue,
    deleteListValue,
    addSetValue,
    updateSetValue,
    deleteSetValue,
    addZsetValue,
    updateZsetValue,
    deleteZsetValue,
    appSettings,
    refreshIndicator,
    showMessage,
  } = props;

  const renderValue = () => {
    switch (object.dataType) {
      case 'string':
        return (
          <StringValue
            updateObjectValue={updateObjectValue}
            object={object}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
          />
        );
      case 'hash':
        return (
          <HashValue
            addHashField={addHashField}
            updateHashField={updateHashField}
            updateHashValue={updateHashValue}
            deleteHashField={deleteHashField}
            object={object}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
          />
        );
      case 'list':
        return (
          <ListValue
            addListValue={addListValue}
            updateListValue={updateListValue}
            deleteListValue={deleteListValue}
            object={object}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
          />
        );
      case 'set':
        return (
          <SetValue
            addSetValue={addSetValue}
            updateSetValue={updateSetValue}
            deleteSetValue={deleteSetValue}
            object={object}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
          />
        );
      case 'zset':
        return (
          <ZsetValue
            addZsetValue={addZsetValue}
            updateZsetValue={updateZsetValue}
            deleteZsetValue={deleteZsetValue}
            object={object}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
          />
        );
      default:
        return null;
    }
  };

  return <div className={classes.appObjectValueRoot}>{renderValue()}</div>;
});
