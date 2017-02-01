'use strict';

const { ipcMain, Menu, app } = require('electron');
const { createWindow, createNewWindow, getMainWindow } = require('./main.electron-utils');
const packageDetails = require('./package.json');
const menuConfig = require('./menu.config');

console.log("app.getName()", app.getName());
console.log("app.getAppPath()", app.getAppPath());
console.log("app.getVersion()", app.getVersion());
// app.dock.bounce();
// app.dock.setBadge('text')

// ------------------------------------
// Set Global Values
// ------------------------------------
global.configPath = app.getPath('userData');
global.appVersion = packageDetails.version;

// ------------------------------------
// Listen for Renderer (Browser-side) Events
// ------------------------------------
ipcMain.on('new-window', createNewWindow);
ipcMain.on('about-window', createNewWindow);

// ------------------------------------
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// ------------------------------------
app.on('ready', () => {
  Menu.setApplicationMenu(menuConfig.createMenu());
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (getMainWindow() === null) {
    createWindow();
  }
});


