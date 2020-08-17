import React from 'react';
import { makeStyles, createStyles, TextField, Theme } from '@material-ui/core';
import { AppConnEditDialogFormData } from './AppConnEditDialog';

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
  })
);

export interface AppConnEditAdvancedSettingsProps {
  formData: AppConnEditDialogFormData;
  handleChange: (
    key: string
  ) => (ev: React.ChangeEvent<{ value: string }>) => void;
  handleChangeCheckbox: (
    key: string
  ) => (ev: React.ChangeEvent<{ checked: boolean }>) => void;
}

export const AppConnEditAdvancedSettings = React.memo(
  (props: AppConnEditAdvancedSettingsProps) => {
    const classes = useStyles();

    const { formData, handleChange, handleChangeCheckbox } = props;

    return (
      <div className={classes.appConnAddSettingsRoot}>
        {/*<div className={classes.appConnAddSettingsRow}>
          <header>Keys loading</header>
        </div>*/}
        {/*<div className={classes.appConnAddSettingsRow}>
          <TextField
            spellCheck={false}
            className={classes.longInput}
            variant="outlined"
            label="Default Filter"
            value={formData.advDefaultFilter}
            onChange={handleChange('advDefaultFilter')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>*/}
        <div className={classes.appConnAddSettingsRow}>
          <TextField
            spellCheck={false}
            className={classes.longInput}
            variant="outlined"
            label="Namespace Separator"
            value={formData.advNameSpaceSeparator}
            onChange={handleChange('advNameSpaceSeparator')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        {/*<div className={classes.appConnAddSettingsRow}>
          <header>Timeouts & Limits</header>
        </div>*/}
        <div className={classes.appConnAddSettingsRow}>
          <TextField
            spellCheck={false}
            className={classes.longInput}
            variant="outlined"
            label="Connection Timout(sec)"
            type="number"
            value={formData.advConnectionTimeout}
            onChange={handleChange('advConnectionTimeout')}
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
            label="Total Retry Time(sec)"
            type="number"
            value={formData.advTotalRetryTime}
            onChange={handleChange('advTotalRetryTime')}
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
            label="Retry Attempts"
            value={formData.advMaxAttempts}
            type="number"
            onChange={handleChange('advMaxAttempts')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        {/*<div className={classes.appConnAddSettingsRow}>
          <TextField
            spellCheck={false}
            className={classes.longInput}
            variant="outlined"
            label="Execution Timeout"
            value={formData.advExecutionTimeout}
            onChange={handleChange('advExecutionTimeout')}
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
            label="Database discovery limit"
            value={formData.advDatabasesDiscoveryLimit}
            onChange={handleChange('advDatabasesDiscoveryLimit')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>*/}
        {/*<div className={classes.appConnAddSettingsRow}>
          <header>Cluster</header>
        </div>
        <div className={classes.appConnAddSettingsRow}>
          <FormControlLabel
            className={classes.longInput}
            label="Change host on cluster redirects"
            control={
              <Checkbox
                checked={formData.advChangeHostOnClusterRediects}
                onChange={handleChangeCheckbox(
                  'advChangeHostOnClusterRediects'
                )}
                color="primary"
              />
            }
          />
        </div>*/}
      </div>
    );
  }
);
