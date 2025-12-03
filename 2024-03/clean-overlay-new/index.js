const { app, BrowserWindow, screen, ipcMain, globalShortcut } = require('electron');
const path = require('path');

function moveCursor() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const x = 400 + (width - 800);
  const y = height / 2;
}

if (require('electron-squirrel-startup')) {
  app.quit();
}

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

app.disableDomainBlockingFor3DAPIs();

/** @type {BrowserWindow} */
let mainWindow;

var visible = false;

function handleVisible(value) {
  visible = value;
  mainWindow.webContents.send('toggle-visibility', visible);

  if (visible) {
    mainWindow.setIgnoreMouseEvents(false);
    app.focus({ steal: true });
    mainWindow.focus({ steal: true});
    // moveCursor();
  } else {
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
    mainWindow.blur();
  }
}

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    hasShadow: false,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    fullscreenable: false,
    movable: false,
    resizable: false,
    hiddenInMissionControl: true,
    paintWhenInitiallyHidden: true,
    roundedCorners: false
  });

  app.dock.hide();
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  
  globalShortcut.register('CommandOrControl+Alt+Enter', () => handleVisible(!visible));
  ipcMain.on('toggle-visibility', (event, value) => handleVisible(value));
  ipcMain.on('get-visibility', (event) => handleVisible(visible));
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
