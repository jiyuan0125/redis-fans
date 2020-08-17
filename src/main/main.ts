import { app, BrowserWindow } from 'electron';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | undefined;

function createMainWindow() {
  const window = new BrowserWindow({
    minWidth: 1200,
    minHeight: 600,
    width: 1800,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    titleBarStyle: 'hidden',
  });

  if (isDevelopment) {
    //window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTORN_RENDERER_PORT}`);
  } else {
    window.loadFile('index.html');
  }

  window.on('closed', () => {
    mainWindow = undefined;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === undefined) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
