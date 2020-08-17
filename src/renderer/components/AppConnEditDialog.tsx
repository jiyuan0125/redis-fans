import React from 'react';

import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobal } from '@src/hooks/useGlobal';
import { AppConnEditSettings } from './AppConnEditSettings';
import { AppConnEditAdvancedSettings } from './AppConnEditAdvancedSettings';
import { useImmer } from 'use-immer';
import { Connection } from '@src/types';
import { resetFormData } from '@src/utils/common';
import electron from 'electron';
import { AppTabs } from './common/AppTabs';
import { AppTab } from './common/AppTab';
import { AppTabPanel } from './common/AppTabPane';

const useStyles = makeStyles(() =>
  createStyles({
    connAddDialogRoot: {},
    connAddDialogContent: {
      width: 600,
    },
    actionsRoot: {
      display: 'flex',
    },
    actionsLeft: {
      flexGrow: 1,
      display: 'flex',
    },
    actionsRight: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'flex-end',
    },
  })
);

const initialFormData: Connection = {
  id: '',
  name: '',
  host: '',
  port: 6379,
  password: '',
  securityType: undefined,
  sslPublicKey: '',
  sslPrivateKey: '',
  sslAuthority: '',
  sslEnableStrictMode: false,
  sshHost: '',
  sshPort: 22,
  sshUser: '',
  sshEnablePrivateKey: false,
  sshPrivateKey: '',
  sshEnablePassword: false,
  sshPassword: '',
  sshEnableTlsOverSsh: false,
  advDefaultFilter: '*',
  advNameSpaceSeparator: ':',
  advConnectionTimeout: 5,
  advTotalRetryTime: 10,
  advMaxAttempts: 3,
  advExecutionTimeout: 60,
  advDatabasesDiscoveryLimit: 20,
  advChangeHostOnClusterRediects: true,
};

export type AppConnEditDialogFormData = typeof initialFormData;

export interface AppConnEditDialogProps {
  connection?: Connection;
  connEditDialogVisible: boolean;
  setConnEditDialogVisible: (visible: boolean) => void;
  saveConnection: (conn: Connection) => void;
  testConnection: (conn: Connection) => void;
}

export const AppConnEditDialog = React.memo((props: AppConnEditDialogProps) => {
  const { showMessage } = useGlobal();
  const [formData, updateFormData] = useImmer(initialFormData);

  const {
    connEditDialogVisible,
    setConnEditDialogVisible,
    saveConnection,
    testConnection,
  } = props;
  const [activeTabId, setActiveTabId] = React.useState('basic');
  const classes = useStyles();

  const validateFromData = () => {
    return true;
  };

  React.useEffect(() => {
    updateFormData((draft) => {
      if (props.connection) {
        resetFormData(draft, props.connection);
      } else {
        resetFormData(draft, initialFormData);
      }
    });
  }, [props.connection]);

  const handleCommit = () => {
    if (!validateFromData()) {
      showMessage('error', 'invalid form data');
    }
    saveConnection(formData as Connection);
    updateFormData((draft) => {
      resetFormData(draft, initialFormData);
    });
    handleCancel();
  };

  const handleCancel = () => {
    setConnEditDialogVisible(false);
  };

  const handleTabChange = (_ev: React.ChangeEvent<{}>, tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleChange = (key: string) => (
    ev: React.ChangeEvent<{ value: string }>
  ) => {
    ev.persist();
    updateFormData((draft) => {
      draft[key] = ev.target.value;
    });
  };

  const handleSelectFile = (key: string) => async () => {
    const options = {};

    const browserWindow = electron.remote.getCurrentWindow();
    const dialog = electron.remote.dialog;
    const result = await dialog.showOpenDialog(browserWindow, options);
    updateFormData((draft) => {
      draft[key] = result.filePaths[0];
    });
  };

  const handleChangeSecurityType = (
    sType: 'SSL/TSL' | 'SSHTunnel' | undefined
  ) => (ev: React.ChangeEvent<{ checked: boolean }>) => {
    ev.persist();
    updateFormData((draft) => {
      if (ev.target.checked) {
        draft.securityType = sType;
      } else {
        draft.securityType = undefined;
      }
    });
  };

  const handleChangeCheckbox = (key: string) => (
    ev: React.ChangeEvent<{ checked: boolean }>
  ) => {
    ev.persist();
    updateFormData((draft) => {
      draft[key] = ev.target.checked;
    });
  };

  const handleTestConnection = () => {
    testConnection(formData as Connection);
  };

  return (
    <div className={classes.connAddDialogRoot}>
      <Dialog open={connEditDialogVisible} onClose={handleCancel} scroll="body">
        <DialogTitle>
          {props.connection ? 'Edit' : 'New'} Connection
        </DialogTitle>
        <DialogContent className={classes.connAddDialogContent}>
          <AppTabs value={activeTabId} onChange={handleTabChange}>
            <AppTab label="Connection Settings" value="basic" key="basic" />
            <AppTab label="Advanced Settings" value="advanced" key="advanced" />
          </AppTabs>
          <>
            <AppTabPanel value="basic" activeValue={activeTabId}>
              <AppConnEditSettings
                formData={formData}
                handleChange={handleChange}
                handleChangeCheckbox={handleChangeCheckbox}
                handleChangeSecurityType={handleChangeSecurityType}
                handleSelectFile={handleSelectFile}
              />
            </AppTabPanel>
            <AppTabPanel value="advanced" activeValue={activeTabId}>
              <AppConnEditAdvancedSettings
                formData={formData}
                handleChange={handleChange}
                handleChangeCheckbox={handleChangeCheckbox}
              />
            </AppTabPanel>
          </>
        </DialogContent>
        <DialogActions className={classes.actionsRoot}>
          <div className={classes.actionsLeft}>
            <Button onClick={handleTestConnection} color="primary">
              Test Connection
            </Button>
          </div>
          <div className={classes.actionsRight}>
            <Button onClick={handleCommit} color="primary">
              OK
            </Button>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
});
