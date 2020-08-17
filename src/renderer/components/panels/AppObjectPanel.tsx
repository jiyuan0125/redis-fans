import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AppObjectBasic } from '@src/components/AppObjectBasic';
import { AppObjectValue } from '@src/components/AppObjectValue';
import { Tab, DataObject, Settings, MessageType } from '@src/types';

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
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
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
    showMessage,
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
  }, [refreshIndicator]);

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
        updateObjectValue={updateObjectValue}
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
      />
    </div>
  );
});
