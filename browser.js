const { BrowserWindowConstructorOptions, BrowserWindow, BrowserView } = require('electron');

class BrowserTab {
  constructor() {
    this.browserView = new BrowserView();
    this.browserView.webContents.loadURL('https://www.google.com');
  }

  /** @returns {BrowserView} */
  getBrowserView() { return this.browserView; }
  /** @returns {string} */
  getURL() { return this.browserView.webContents.getURL(); }
  /** @returns {string} */
  getTitle() { return this.browserView.webContents.getTitle(); }
  /** @returns {string} */
  getFavicon() { return this.browserView.webContents.getFavicon(); }
  /** @returns {string} */
  getWebContents() { return this.browserView.webContents; }

  /** @param {string} url */
  loadURL(url) { this.browserView.webContents.loadURL(url); }
  /** @param {string} url */
  loadFile(url) { this.browserView.webContents.loadFile(url); }
  /** @param {string} url */
  loadHTML(url) { this.browserView.webContents.loadHTML(url); }

  /** @type {BrowserView} */
  browserView;
}

/** @type {BrowserWindow} */
let mainWindow;
/** @type {BrowserView} */
let uiView;
/** @type {BrowserTab[]} */
let browserData = [];

let windowSize = { width: 1080, height: 720 };
let windowPosition = { x: 0, y: 0 };
let webPreferences = { nodeIntegration: true };

/** @returns {BrowserWindowConstructorOptions} */
const globalConfig = () => {
  return {
    width: windowSize.width,
    height: windowSize.height,
    webPreferences: webPreferences,
    x: 0,
    y: 0
  }
};

/** @returns {BrowserWindowConstructorOptions} */
const mainWindowConfig = () => {
  return {
    ...globalConfig(),
    x: windowPosition.x,
    y: windowPosition.y,
    titleBarStyle: 'hidden',
    frame: false
  }
};

/** @returns {BrowserWindowConstructorOptions} */
const uiViewConfig = () => {
  return {
    ...globalConfig(),
    height: 80
  }
};

/** @returns {BrowserWindowConstructorOptions} */
const browserViewConfig = () => {
  return {
    ...globalConfig(),
    height: windowSize.height - uiViewConfig().height,
    y: uiViewConfig().height
  }
};

let updateLock = false;

function updateWindowSize() {
  if (mainWindow.isFullScreen()) return;

  if (updateLock) return;
  updateLock = true;

  windowSize = {
    width: mainWindow.getSize()[0],
    height: mainWindow.getSize()[1]
  };

  if (mainWindow.isMaximized()) {
    windowPosition = {
      x: 0,
      y: 0
    };
  } else {
    windowPosition = {
      x: mainWindow.getPosition()[0],
      y: mainWindow.getPosition()[1]
    };
  }

  mainWindow.setBounds(mainWindowConfig());
  uiView.setBounds(uiViewConfig());

  for (let i = 0; i < browserData.length; i++)
    browserData[i].getBrowserView().setBounds(browserViewConfig());

  updateLock = false;
}

function fullscreenWindowHandle() {
  windowSize = {
    width: mainWindow.getSize()[0],
    height: mainWindow.getSize()[1]
  };
  
  windowPosition = {
    x: 0,
    y: 0
  };

  mainWindow.setBounds(mainWindowConfig());
  uiView.setBounds(uiViewConfig());

  for (let i = 0; i < browserData.length; i++)
    browserData[i].getBrowserView().setBounds(browserViewConfig());
}

function groupEvent(name, callback) {
  uiView.webContents.on(name, callback);
  for (let i = 0; i < browserData.length; i++)
    browserData[i].getWebContents().on(name, callback);
  mainWindow.webContents.on(name, callback);
}

function createWindow() {
  mainWindow = new BrowserWindow(mainWindowConfig());

  // Hide macOS traffic lights
  mainWindow.setWindowButtonVisibility(false);

  mainWindow.on('resize', () => { setTimeout(updateWindowSize, 0) });
  mainWindow.on('move', () => { setTimeout(updateWindowSize, 0) });
  mainWindow.on('enter-full-screen', () => { setTimeout(fullscreenWindowHandle, 0) });

  uiView = new BrowserView(uiViewConfig());
  mainWindow.addBrowserView(uiView);
  uiView.webContents.loadFile('./src/index.html');
  uiView.setBounds(uiViewConfig());

  browserData.push(new BrowserTab());
  mainWindow.addBrowserView(browserData[0].getBrowserView());
  browserData[0].getBrowserView().setBounds(browserViewConfig());

  // Catch keystrokes:
  groupEvent('before-input-event', (event, input) => {
    if (input.key === 'r' && (input.control || input.meta)) {
      mainWindow.reload();
      uiView.webContents.reload();
    }
  });

  uiView.webContents.openDevTools({
    mode: 'detach'
  });
}

module.exports = {
  mainWindow, browserData, browserData,
  createWindow
};
