import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  makeStyles,
  Theme,
  createStyles,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { useImmer } from 'use-immer';
import { Settings } from '@src/types';
import electron from 'electron';
import { resetFormData } from '@src/utils/common';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appSettingsDialogContent: {
      width: 600,
    },
    formControl: {
      minWidth: 200,
    },
    appSettingsRow: {
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
  })
);

export interface AppSettingsDialogProps {
  appSettingsDialogVisible: boolean;
  setAppSettingsDialogVisible: (visible: boolean) => void;
  saveAppSettings: (appSettings: Settings) => void;
  appSettings: Settings;
}

export const AppSettingsDialog = React.memo((props: AppSettingsDialogProps) => {
  const {
    appSettingsDialogVisible,
    setAppSettingsDialogVisible,
    saveAppSettings,
    appSettings,
  } = props;
  const [formData, updateFormData] = useImmer(appSettings);
  const [fonts, setFonts] = React.useState<string[]>([]);
  const classes = useStyles();

  const loadFonts = React.useCallback(async () => {
    const fontList = electron.remote.require('font-list');
    const systemFonts: string[] = await fontList.getFonts();
    setFonts(systemFonts.map((font) => font.replace(/"/g, '')));
  }, [setFonts]);

  React.useEffect(() => {
    resetFormData(formData, appSettings);
  }, [appSettings]);

  React.useEffect(() => {
    loadFonts();
  }, []);

  const handleChange = React.useCallback(
    (key: string) => (
      ev: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
      ev.persist();
      updateFormData((draft) => {
        draft[key] = ev.target.value;
      });
    },
    [updateFormData]
  );

  //const handleChangeSwitch = React.useCallback(
  //(key: string) => (ev: React.ChangeEvent<{ checked: boolean }>) => {
  //ev.persist();
  //updateFormData((draft) => {
  //draft[key] = ev.target.checked;
  //});
  //},
  //[updateFormData]
  //);

  const handleCancel = React.useCallback(() => {
    setAppSettingsDialogVisible(false);
  }, [setAppSettingsDialogVisible]);

  const handleSubmit = React.useCallback(() => {
    saveAppSettings(formData);
    handleCancel();
  }, [saveAppSettings, formData, handleCancel]);

  return (
    <div>
      <Dialog open={appSettingsDialogVisible} onClose={handleCancel}>
        <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
        <DialogContent className={classes.appSettingsDialogContent}>
          <div className={classes.appSettingsRow}>
            <header>General</header>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="AppSettingsLanguage">Language</InputLabel>
              <Select
                value={formData.language}
                labelId="AppSettingsLanguage"
                label="Language"
                onChange={handleChange('language')}
              >
                <MenuItem value="English">English</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="AppSettingsUiFont">UI Font</InputLabel>
              <Select
                value={formData.uiFont}
                labelId="AppSettingsUiFont"
                label="UI Font"
                onChange={handleChange('uiFont')}
              >
                <MenuItem
                  style={{ fontFamily: 'monospace' }}
                  key="monospace"
                  value="monospace"
                >
                  monospace
                </MenuItem>
                {fonts.map((font) => (
                  <MenuItem
                    key={font}
                    style={{ fontFamily: font }}
                    value={font}
                  >
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="AppSettingsUiFontSize">UI Font Size</InputLabel>
              <Select
                value={formData.uiFontSize}
                labelId="AppSettingsUiFontSize"
                label="UI Font Size"
                onChange={handleChange('uiFontSize')}
              >
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="9">9</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="11">11</MenuItem>
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="13">13</MenuItem>
                <MenuItem value="14">14</MenuItem>
                <MenuItem value="15">15</MenuItem>
                <MenuItem value="16">16</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="AppSettingsEditorFont">Editor Font</InputLabel>
              <Select
                value={formData.editorFont}
                labelId="AppSettingsEditorFont"
                label="Editor Font"
                onChange={handleChange('editorFont')}
              >
                <MenuItem
                  style={{ fontFamily: 'monospace' }}
                  key="monospace"
                  value="monospace"
                >
                  monospace
                </MenuItem>
                {fonts.map((font) => (
                  <MenuItem
                    key={font}
                    style={{ fontFamily: font }}
                    value={font}
                  >
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="AppSettingsEditorFontSize">
                Editor Font Size
              </InputLabel>
              <Select
                value={formData.editorFontSize}
                labelId="AppSettingsEditorFontSize"
                label="Editor Font Size"
                onChange={handleChange('editorFontSize')}
              >
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="9">9</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="11">11</MenuItem>
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="13">13</MenuItem>
                <MenuItem value="14">14</MenuItem>
                <MenuItem value="15">15</MenuItem>
                <MenuItem value="16">16</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="AppSettingsTerminalFont">
                Terminal Font
              </InputLabel>
              <Select
                value={formData.terminalFont}
                labelId="AppSettingsTerminalFont"
                label="Terminal Font"
                onChange={handleChange('terminalFont')}
              >
                <MenuItem
                  style={{ fontFamily: 'monospace' }}
                  key="monospace"
                  value="monospace"
                >
                  monospace
                </MenuItem>
                {fonts.map((font) => (
                  <MenuItem
                    key={font}
                    style={{ fontFamily: font }}
                    value={font}
                  >
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="AppSettingsTerminalFontSize">
                Terminal Font Size
              </InputLabel>
              <Select
                value={formData.terminalFontSize}
                labelId="AppSettingsTerminalFontSize"
                label="Terminal Font Size"
                onChange={handleChange('terminalFontSize')}
              >
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="9">9</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="11">11</MenuItem>
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="13">13</MenuItem>
                <MenuItem value="14">14</MenuItem>
                <MenuItem value="15">15</MenuItem>
                <MenuItem value="16">16</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="AppSettingsTerminalTheme">
                Terminal Theme
              </InputLabel>
              <Select
                value={formData.terminalTheme}
                labelId="AppSettingsTerminalTheme"
                label="Terminal Theme"
                onChange={handleChange('terminalTheme')}
              >
                <MenuItem value="gruvbox_dark">gruvbox_dark</MenuItem>
                <MenuItem value="onedark">onedark</MenuItem>
                <MenuItem value="github">github</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/*
          <div className={classes.appSettingsRow}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.useSystemProxySettings}
                  onChange={handleChangeSwitch('useSystemProxySettings')}
                  color="primary"
                />
              }
              label="Use System Proxy Settings"
            />
          </div>
          <div className={classes.appSettingsRow}>
            <header>Connections Tree</header>
          </div>
          <div className={classes.appSettingsRow}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.reopenNamespacesOnReload}
                  onChange={handleChangeSwitch('reopenNamespacesOnReload')}
                  color="primary"
                />
              }
              label="Repone namespaces on reload"
            />
          </div>
          <div className={classes.appSettingsRow}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enableKeySortingInTree}
                  onChange={handleChangeSwitch('enableKeySortingInTree')}
                  color="primary"
                />
              }
              label="Enable key sorting in tree"
            />
          </div>
          <div className={classes.appSettingsRow}>
            <TextField
              spellCheck={false}
              type="number"
              fullWidth
              variant="outlined"
              label="Live update maximum allowed keys"
              value={formData.liveUpdateMaximumAllowedKeys}
              onChange={handleChange('liveUpdateMaximumAllowedKeys')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className={classes.appSettingsRow}>
            <TextField
              spellCheck={false}
              type="number"
              variant="outlined"
              label="Live update interval (in seconds)"
              value={formData.liveUpdateInterval}
              onChange={handleChange('liveUpdateInterval')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
