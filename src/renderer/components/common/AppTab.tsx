import React from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import { Tab } from '@material-ui/core';
import { CloseIcon } from '@src/icons/CloseIcon';

export interface AppTabProps {
  label: string | React.ReactNode;
  value: any;
  icon?: string | React.ReactElement;
  onClose?: (ex: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  onContextMenu?: (ex: React.MouseEvent) => void;
  classes?: object;
  className?: string;
  style?: object;
  ref?: any;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 50,
      maxWidth: 'none',
      fontWeight: theme.typography.fontWeightMedium,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      '&:hover': {
        color: theme.palette.grey.A700,
        backgroundColor: theme.palette.grey['300'],
        opacity: 1,
      },
      '&$selected': {
        color: theme.palette.grey.A700,
        backgroundColor: theme.palette.grey['300'],
      },
      '&:focus': {
        color: theme.palette.grey.A700,
        backgroundColor: theme.palette.grey['300'],
      },
    },
    selected: {},
  });

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appTabRoot: {
      display: 'flex',
    },
    label: {
      flexFlow: '1',
      marginRight: theme.spacing(1),
    },
    close: {
      width: 10,
      height: 10,
    },
    closeIcon: {
      borderRadius: '50%',
      verticalAlign: 'middle',
      fontSize: 12,
      color: theme.palette.grey['400'],
      '&:hover': {
        backgroundColor: theme.palette.grey['500'],
      },
    },
  })
);

export const AppTab = React.memo(
  withStyles(styles)(
    React.forwardRef((props: AppTabProps, ref) => {
      const classes = useStyles();

      const handleClose = (ex: React.MouseEvent) => {
        ex.stopPropagation();
        if (props.onClose) {
          props.onClose(ex);
        }
      };

      const closableLabel = (
        <span className={classes.appTabRoot}>
          <span className={classes.label}>{props.label}</span>
          {props.onClose && (
            <span onClick={handleClose} className={classes.close}>
              <CloseIcon className={classes.closeIcon} />
            </span>
          )}
        </span>
      );
      return <Tab ref={ref} {...props} label={closableLabel}></Tab>;
    })
  )
);
