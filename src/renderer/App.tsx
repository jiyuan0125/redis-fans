import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { AppContent } from '@src/components/AppContent';
import { AppFooter } from '@src/components/AppFooter';
import { AppMessage } from './components/AppMessage';
import { useGlobal } from './hooks/useGlobal';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const useStyles = makeStyles(() =>
  createStyles({
    '@global': {
      'html, body, #app': {
        height: '100%',
        userSelect: 'none',
        boxSizing: 'border-box',
      },
      '::-webkit-scrollbar': {
        width: 20,
        height: 20,
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#cccccc',
        backgroundClip: 'content-box',
        border: '6px solid transparent',
        borderRadius: 10,
      },
      '::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#bbbbbb',
      },
    },
    appRoot: {
      height: '100%',
      display: 'flex',
      flexFlow: 'column',
    },
    appRootContent: {
      flexGrow: 1,
    },
  })
);

export const App = () => {
  const classes = useStyles();
  const useGlobalHook = useGlobal();
  const {
    loadAppSettingsFromDB,
    globalState: { message },
    closeMessage,
  } = useGlobalHook;

  React.useEffect(() => {
    loadAppSettingsFromDB();
  }, []);

  return (
    <>
      <CssBaseline />
      <DndProvider backend={HTML5Backend}>
        <div className={classes.appRoot}>
          <AppContent
            className={classes.appRootContent}
            useGlobalHook={useGlobalHook}
          />
          <AppFooter useGlobalHook={useGlobalHook} />
        </div>
        <AppMessage closeMessage={closeMessage} message={message} />
      </DndProvider>
    </>
  );
};
