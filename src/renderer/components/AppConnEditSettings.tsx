import React from 'react';
import {
  makeStyles,
  createStyles,
  TextField,
  Theme,
  FormControlLabel,
  Checkbox,
  Button,
} from '@material-ui/core';
import { AppConnEditDialogFormData } from './AppConnEditDialog';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appConnAddSettingsRoot: {},
    appConnAddSettingsRow: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    longInput: {
      flexGrow: 1,
    },
    mediumInput: {
      width: 200,
    },
    shortInput: {
      marginLeft: theme.spacing(1),
      width: 100,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    securityContent: {
      '& .MuiExpansionPanelDetails-root': {
        display: 'block',
      },
    },
    showPassword: {
      marginLeft: theme.spacing(1),
    },
  })
);

export interface AppConnEditSettingsProps {
  formData: AppConnEditDialogFormData;
  handleChange: (
    key: string
  ) => (ev: React.ChangeEvent<{ value: string }>) => void;
  handleChangeCheckbox: (
    key: string
  ) => (ev: React.ChangeEvent<{ checked: boolean }>) => void;
  handleChangeSecurityType: (
    sType: 'SSL/TSL' | 'SSHTunnel' | undefined
  ) => (ev: React.ChangeEvent<{ checked: boolean }>) => void;
  handleSelectFile: (key: string) => () => void;
}

export const AppConnEditSettings = React.memo(
  (props: AppConnEditSettingsProps) => {
    const classes = useStyles();

    const [showPassword, setShowPassword] = React.useState(false);
    //const [showSshPassword, setShowSshPassword] = React.useState(false);

    const {
      formData,
      handleChange,
      handleChangeCheckbox,
      handleChangeSecurityType,
      handleSelectFile,
    } = props;

    return (
      <div className={classes.appConnAddSettingsRoot}>
        <div className={classes.appConnAddSettingsRow}>
          <TextField
            spellCheck={false}
            className={classes.longInput}
            variant="outlined"
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className={classes.appConnAddSettingsRow}>
          <TextField
            spellCheck={false}
            className={classes.longInput}
            variant="outlined"
            label="Host"
            value={formData.host}
            onChange={handleChange('host')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            spellCheck={false}
            className={classes.shortInput}
            type="number"
            variant="outlined"
            label="Port"
            value={formData.port}
            onChange={handleChange('port')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className={classes.appConnAddSettingsRow}>
          <TextField
            spellCheck={false}
            className={classes.longInput}
            type={showPassword ? 'input' : 'password'}
            variant="outlined"
            label="Auth"
            value={formData.password}
            onChange={handleChange('password')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControlLabel
            className={clsx(classes.mediumInput, classes.showPassword)}
            control={
              <Checkbox
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                color="primary"
              />
            }
            label="Show password"
          />
        </div>
        <div className={classes.appConnAddSettingsRow}>
          <FormControlLabel
            className={classes.mediumInput}
            control={
              <Checkbox
                checked={formData.securityType === 'SSL/TSL'}
                onChange={handleChangeSecurityType('SSL/TSL')}
                color="primary"
              />
            }
            label="SSL/TLS"
          />
        </div>
        <div className={classes.securityContent}>
          {/*<ExpansionPanel expanded={formData.securityType === 'SSL/TSL'}>
            <ExpansionPanelSummary>
              <FormControlLabel
                className={classes.mediumInput}
                control={
                  <Radio
                    checked={formData.securityType === 'SSL/TSL'}
                    name="securityType"
                    onClick={handleChangeSecurityType('SSL/TSL')}
                    color="primary"
                  />
                }
                label="SSL/TLS"
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>*/}
          <div className={classes.appConnAddSettingsRow}>
            <TextField
              spellCheck={false}
              className={classes.longInput}
              variant="outlined"
              label="Public Keys"
              value={formData.sslPublicKey}
              placeholder="(Optional) Public Key in PEM format"
              onChange={handleChange('sslPublicKey')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              className={classes.shortInput}
              onClick={handleSelectFile('sslPublicKey')}
            >
              Select File
            </Button>
          </div>
          <div className={classes.appConnAddSettingsRow}>
            <TextField
              spellCheck={false}
              className={classes.longInput}
              variant="outlined"
              label="Private Keys"
              placeholder="(Optional) Private Key in PEM format"
              value={formData.sslPrivateKey}
              onChange={handleChange('sslPrivateKey')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              className={classes.shortInput}
              onClick={handleSelectFile('sslPrivateKey')}
            >
              Select File
            </Button>
          </div>
          <div className={classes.appConnAddSettingsRow}>
            <TextField
              spellCheck={false}
              className={classes.longInput}
              variant="outlined"
              label="Authority"
              placeholder="(Optional) Authority in PEM format"
              value={formData.sslAuthority}
              onChange={handleChange('sslAuthority')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              className={classes.shortInput}
              onClick={handleSelectFile('sslAuthority')}
            >
              Select File
            </Button>
          </div>
          <div className={classes.appConnAddSettingsRow}>
            <FormControlLabel
              className={classes.longInput}
              control={
                <Checkbox
                  checked={formData.sslEnableStrictMode}
                  onChange={handleChangeCheckbox('sslEnableStrictMode')}
                  color="primary"
                />
              }
              label="Enable strict mode"
            />
          </div>
          {/*</ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={formData.securityType === 'SSHTunnel'}>
            <ExpansionPanelSummary>
              <FormControlLabel
                className={classes.mediumInput}
                control={
                  <Radio
                    checked={formData.securityType === 'SSHTunnel'}
                    name="securityType"
                    onClick={handleChangeSecurityType('SSHTunnel')}
                    color="primary"
                  />
                }
                label="SSH Tunnel"
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={classes.appConnAddSettingsRow}>
                <TextField
                  spellCheck={false}
                  className={classes.longInput}
                  variant="outlined"
                  label="SSH Address"
                  value={formData.sshHost}
                  placeholder="Remote Host with SSH server"
                  onChange={handleChange('sshHost')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  spellCheck={false}
                  className={classes.shortInput}
                  variant="outlined"
                  label="Port"
                  type="number"
                  value={formData.sshPort}
                  onChange={handleChange('number')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className={classes.appConnAddSettingsRow}>
                <TextField
                  spellCheck={false}
                  className={classes.longInput}
                  variant="outlined"
                  label="SSH User"
                  value={formData.sshUser}
                  placeholder="Valid SSH User Name"
                  onChange={handleChange('sshUser')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className={classes.appConnAddSettingsRow}>
                <FormControlLabel
                  className={classes.longInput}
                  control={
                    <Checkbox
                      checked={formData.sshEnablePrivateKey}
                      onChange={handleChangeCheckbox('sshEnablePrivateKey')}
                      color="primary"
                    />
                  }
                  label="Enable Private Key"
                />
              </div>
              <div className={classes.appConnAddSettingsRow}>
                <TextField
                  spellCheck={false}
                  className={classes.longInput}
                  variant="outlined"
                  label="Private Key"
                  placeholder="Path to Private Key in PEM format"
                  value={formData.sshPrivateKey}
                  onChange={handleChange('privateKey')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Button
                  variant="contained"
                  className={classes.shortInput}
                  onClick={() => console.log('select file')}
                >
                  Select File
                </Button>
              </div>
              <div className={classes.appConnAddSettingsRow}>
                <FormControlLabel
                  className={classes.longInput}
                  control={
                    <Checkbox
                      checked={formData.sshEnablePassword}
                      onChange={handleChangeCheckbox('sshEnablePassword')}
                      color="primary"
                    />
                  }
                  label="Enable Password"
                />
              </div>
              <div className={classes.appConnAddSettingsRow}>
                <TextField
                  spellCheck={false}
                  className={classes.longInput}
                  type={showSshPassword ? 'input' : 'password'}
                  variant="outlined"
                  label="Auth"
                  value={formData.password}
                  onChange={handleChange('password')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControlLabel
                  className={classes.mediumInput}
                  control={
                    <Checkbox
                      checked={showSshPassword}
                      onChange={() => setShowSshPassword(!showSshPassword)}
                      color="primary"
                    />
                  }
                  label="Show password"
                />
              </div>
              <div className={classes.appConnAddSettingsRow}>
                <FormControlLabel
                  className={classes.longInput}
                  control={
                    <Checkbox
                      checked={formData.sshEnableTlsOverSsh}
                      onChange={handleChangeCheckbox('sshEnableTlsOverSsh')}
                      color="primary"
                    />
                  }
                  label="Enable TLS-over-SSH(AWS ElastisCache Encryption in-transit)"
                />
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>*/}
        </div>
      </div>
    );
  }
);
