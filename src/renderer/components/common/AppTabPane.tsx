import React from 'react';
import { Box, createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

export interface TabPanelProps {
  children?: React.ReactNode;
  activeValue: any;
  value: any;
  classes?: Record<string, any>;
  className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appTabPanelRoot: {
      flex: 1,
      '& .MuiBox-root': {
        padding: 0,
      },
    },
    box: {
      height: '100%',
      boxSizing: 'border-box',
      padding: `0 ${theme.spacing(1)}px`,
    },
  })
);

export const AppTabPanel = React.memo((props: TabPanelProps) => {
  const { children, value, activeValue, ...other } = props;
  const classes = useStyles(props);

  return (
    <div
      role="tabpanel"
      hidden={value !== activeValue}
      {...other}
      className={clsx(classes.appTabPanelRoot, props.className)}
    >
      <Box p={1} className={classes.box}>
        {children}
      </Box>
    </div>
  );
});
