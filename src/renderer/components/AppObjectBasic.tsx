import React from 'react';
import clsx from 'clsx';
import { createStyles, TextField, Theme, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StringIcon } from '@src/icons/StringIcon';
import { HashIcon } from '@src/icons/HashIcon';
import { ListIcon } from '@src/icons/ListIcon';
import { SetIcon } from '@src/icons/SetIcon';
import { ZsetIcon } from '@src/icons/ZsetIcon';
import { AppRenameKey } from '@src/components/AppRenameKey';
import { AppExpireKey } from '@src/components/AppExpireKey';
import { AppDeleteKey } from '@src/components/AppDeleteKey';
import { DeleteIcon } from '@src/icons/DeleteIcon';
import { DataObject, Settings, MessageType } from '@src/types';
import { UnknownIcon } from '@src/icons/UnknownIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appObjectBasicRoot: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      height: '100%',
      marginRight: theme.spacing(1),
      fontSize: theme.typography.h3.fontSize,
    },
    input: {
      flexGrow: 1,
      '& .MuiFormControl-root,& .MuiInputBase-root': {
        height: '100%',
        alignItems: 'stretch',
        marginRight: theme.spacing(1),
      },
      '& .MuiInputBase-input': {
        fontFamily: (props: Settings) => props.editorFont,
        fontSize: (props: Settings) => `${props.editorFontSize}px`,
      },
    },
    button: {
      marginRight: theme.spacing(1),
    },
    deleteButton: {
      color: theme.palette.error.main,
    },
  })
);

export interface AppObjectBasicProps {
  object: DataObject;
  loadObject: (object: DataObject) => Promise<void>;
  renameObjectKey: (object: DataObject, newKey: string) => void;
  expireObject: (object: DataObject, exprie: number) => void;
  deleteObject: (object: DataObject) => void;
  appSettings: Settings;
  updateRefreshIndicator: () => void;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
}

export const AppObjectBasic = React.memo((props: AppObjectBasicProps) => {
  const {
    loadObject,
    object,
    renameObjectKey,
    expireObject,
    deleteObject,
    appSettings,
    updateRefreshIndicator,
    showMessage,
  } = props;
  const classes = useStyles(appSettings);

  const [renameDialogVisible, setRenameDialogVisible] = React.useState(false);
  const [ttlDialogVisible, setTtlDialogVisible] = React.useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);

  const handleReloadObject = () => {
    loadObject(object);
    updateRefreshIndicator();
  };

  const getIcon = () => {
    switch (object.dataType) {
      case 'string':
        return <StringIcon className={classes.icon} />;
      case 'hash':
        return <HashIcon className={classes.icon} />;
      case 'list':
        return <ListIcon className={classes.icon} />;
      case 'set':
        return <SetIcon className={classes.icon} />;
      case 'zset':
        return <ZsetIcon className={classes.icon} />;
      default:
        return <UnknownIcon className={classes.icon} />;
    }
  };

  return (
    <div className={classes.appObjectBasicRoot}>
      {getIcon()}
      <TextField
        spellCheck={false}
        label="Key"
        variant="outlined"
        className={classes.input}
        value={object.key}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button
        className={classes.button}
        variant="contained"
        onClick={() => setRenameDialogVisible(true)}
      >
        Rename key
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        onClick={() => setTtlDialogVisible(true)}
      >
        TTL:{props.object.expire}
      </Button>
      <Button
        className={clsx(classes.button)}
        startIcon={<DeleteIcon className={classes.deleteButton} />}
        variant="contained"
        onClick={() => {
          setDeleteDialogVisible(true);
        }}
      >
        Delete
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        onClick={handleReloadObject}
      >
        Reload
      </Button>
      <AppRenameKey
        renameDialogVisible={renameDialogVisible}
        setRenameDialogVisible={setRenameDialogVisible}
        object={object}
        renameObjectKey={renameObjectKey}
        showMessage={showMessage}
      />
      <AppExpireKey
        ttlDialogVisible={ttlDialogVisible}
        setTtlDialogVisible={setTtlDialogVisible}
        object={object}
        expireObject={expireObject}
      />
      <AppDeleteKey
        deleteDialogVisible={deleteDialogVisible}
        setDeleteDialogVisible={setDeleteDialogVisible}
        object={object}
        deleteObject={deleteObject}
      />
    </div>
  );
});
