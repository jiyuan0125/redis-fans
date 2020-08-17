import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Session } from '@src/types';
import { LinearProgress } from '@material-ui/core';
import { DIMENSION_APPSESSIONFOOTER_HEIGHT } from '@src/constants';

const useStyles = makeStyles(() => ({
  appSessionFooter: {
    height: DIMENSION_APPSESSIONFOOTER_HEIGHT,
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1200,
  },
}));

export interface AppSessionFooterProps {
  session: Session;
}

export const AppSessionFooter = React.memo((props: AppSessionFooterProps) => {
  const { session } = props;
  const classes = useStyles();

  return (
    <div className={classes.appSessionFooter}>
      {session.progressing && <LinearProgress />}
    </div>
  );
});
