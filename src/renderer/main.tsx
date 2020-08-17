import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '@src/theme';
import 'fontsource-roboto';

import { App } from './App';
import { AppError } from './components/AppError';

ReactDOM.render(
  <AppError>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </AppError>,
  document.getElementById('app')
);
