import React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Tabs } from '@material-ui/core';

const styles = createStyles((theme: Theme) => ({
  root: {},
  indicator: {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const AppTabs = React.memo(withStyles(styles)(Tabs));
