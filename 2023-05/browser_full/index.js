const { app, BrowserWindow, contextBridge, BrowserView } = require('electron');
const path = require('path');
const browser = require('./browser.js');

if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', browser.createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    browser.createWindow();
  }
});
