import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AppObjectBasic } from '@src/components/AppObjectBasic';
import { AppObjectValue } from '@src/components/AppObjectValue';
import {
  Tab,
  DataObject,
  Settings,
  MessageType,
  HashDataObject,
  ZsetDataObject,
  SetDataObject,
  ListDataObject,
  StringDataObject,
} from '@src/types';

export const useStyles = makeStyles(() =>
  createStyles({
    appObjectPanelRoot: {
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  })
);

export interface AppObjectPanelProps {
  tab: Tab;
  getObjectByTab: (tab: Tab) => DataObject | undefined;
  loadObject: (object: DataObject) => Promise<void>;
  renameObjectKey: (object: DataObject, newKey: string) => void;
  expireObject: (object: DataObject, exprie: number) => void;
  deleteObject: (object: DataObject) => void;
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

export const AppObjectPanel = React.memo((props: AppObjectPanelProps) => {
  const {
    getObjectByTab,
    loadObject,
    tab,
    renameObjectKey,
    expireObject,
    deleteObject,
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
    showMessage,
    fetchListValues,
    fetchHashValues,
    fetchSetValues,
    fetchZsetValues,
  } = props;
  const classes = useStyles();
  const object = getObjectByTab(tab);
  const [refreshIndicator, setRefreshIndicator] = React.useState(0);

  React.useEffect(() => {
    const object = getObjectByTab(tab);
    if (object) {
      loadObject(object);
    }
  }, []);

  const updateRefreshIndicator = React.useCallback(() => {
    setRefreshIndicator(refreshIndicator + 1);
  }, [refreshIndicator, setRefreshIndicator]);

  return (
    <div className={classes.appObjectPanelRoot}>
      <AppObjectBasic
        object={object!}
        renameObjectKey={renameObjectKey}
        loadObject={loadObject}
        expireObject={expireObject}
        deleteObject={deleteObject}
        appSettings={appSettings}
        updateRefreshIndicator={updateRefreshIndicator}
        showMessage={showMessage}
      />
      <AppObjectValue
        object={object!}
        updateStringValue={updateStringValue}
        addHashField={addHashField}
        updateHashField={updateHashField}
        updateHashValue={updateHashValue}
        deleteHashField={deleteHashField}
        addListValue={addListValue}
        updateListValue={updateListValue}
        deleteListValue={deleteListValue}
        addSetValue={addSetValue}
        updateSetValue={updateSetValue}
        deleteSetValue={deleteSetValue}
        addZsetValue={addZsetValue}
        updateZsetValue={updateZsetValue}
        deleteZsetValue={deleteZsetValue}
        appSettings={appSettings}
        refreshIndicator={refreshIndicator}
        showMessage={showMessage}
        fetchListValues={fetchListValues}
        fetchHashValues={fetchHashValues}
        fetchSetValues={fetchSetValues}
        fetchZsetValues={fetchZsetValues}
      />
    </div>
  );
});
