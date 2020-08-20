import React from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StringValue } from '@src/components/values/StringValue';
import { HashValue } from '@src/components/values/HashValue';
import { ListValue } from '@src/components/values/ListValue';
import { SetValue } from '@src/components/values/SetValue';
import { ZsetValue } from '@src/components/values/ZsetValue';
import {
  DataObject,
  Settings,
  MessageType,
  HashDataObject,
  ListDataObject,
  SetDataObject,
  ZsetDataObject,
  StringDataObject,
} from '@src/types';

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
  updateStringValue: (object: StringDataObject, value: string) => void;
  addHashField: (object: HashDataObject, field: string, value: string) => void;
  updateHashField: (
    object: HashDataObject,
    oldField: string,
    newField: string,
    value: string
  ) => void;
  updateHashValue: (
    object: HashDataObject,
    field: string,
    value: string
  ) => void;
  deleteHashField: (object: HashDataObject, field: string) => void;
  addListValue: (object: ListDataObject, value: string) => void;
  updateListValue: (
    object: ListDataObject,
    index: number,
    value: string
  ) => void;
  deleteListValue: (object: ListDataObject, index: number) => void;
  addSetValue: (object: SetDataObject, value: string) => void;
  updateSetValue: (
    object: SetDataObject,
    oldValue: string,
    newValue: string
  ) => void;
  deleteSetValue: (object: SetDataObject, value: string) => void;
  addZsetValue: (object: ZsetDataObject, score: number, value: string) => void;
  updateZsetValue: (
    object: ZsetDataObject,
    oldValue: string,
    score: number,
    newValue: string
  ) => void;
  deleteZsetValue: (object: ZsetDataObject, value: string) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
  fetchListValues: (
    object: ListDataObject,
    start: number,
    stop: number
  ) => void;
  fetchHashValues: (
    object: HashDataObject,
    cursor: number,
    match: string,
    count: number
  ) => void;
  fetchSetValues: (
    object: SetDataObject,
    cursor: number,
    match: string,
    count: number
  ) => void;
  fetchZsetValues: (
    object: ZsetDataObject,
    cursor: number,
    match: string,
    count: number
  ) => void;
}

export const AppObjectValue = React.memo((props: AppObjectValueProps) => {
  const classes = useStyles();
  const {
    object,
    updateStringValue,
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
    fetchListValues,
    fetchHashValues,
    fetchSetValues,
    fetchZsetValues,
  } = props;

  const renderValue = React.useCallback(() => {
    switch (object.dataType) {
      case 'string':
        return (
          <StringValue
            updateStringValue={updateStringValue}
            object={object as StringDataObject}
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
            object={object as ListDataObject}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
            fetchListValues={fetchListValues}
          />
        );
      case 'hash':
        return (
          <HashValue
            addHashField={addHashField}
            updateHashField={updateHashField}
            updateHashValue={updateHashValue}
            deleteHashField={deleteHashField}
            object={object as HashDataObject}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
            fetchHashValues={fetchHashValues}
          />
        );
      case 'set':
        return (
          <SetValue
            addSetValue={addSetValue}
            updateSetValue={updateSetValue}
            deleteSetValue={deleteSetValue}
            object={object as SetDataObject}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
            fetchSetValues={fetchSetValues}
          />
        );
      case 'zset':
        return (
          <ZsetValue
            addZsetValue={addZsetValue}
            updateZsetValue={updateZsetValue}
            deleteZsetValue={deleteZsetValue}
            object={object as ZsetDataObject}
            appSettings={appSettings}
            refreshIndicator={refreshIndicator}
            showMessage={showMessage}
            fetchZsetValues={fetchZsetValues}
          />
        );
      default:
        return null;
    }
  }, [
    object,
    updateStringValue,
    appSettings,
    refreshIndicator,
    showMessage,
    addListValue,
    updateListValue,
    deleteListValue,
    fetchListValues,
    addHashField,
    updateHashField,
    updateHashValue,
    fetchHashValues,
    addSetValue,
    updateSetValue,
    deleteSetValue,
    fetchSetValues,
    addZsetValue,
    updateZsetValue,
    deleteZsetValue,
    fetchZsetValues,
  ]);

  return <div className={classes.appObjectValueRoot}>{renderValue()}</div>;
});
