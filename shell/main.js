'use strict';

const { ipcMain, Menu, app } = require('electron');
const { createWindow, createNewWindow, getMainWindow } = require('./main.electron-utils.js');
const packageDetails = require('./../package.json');
const menuConfig = require('./menu.config.js');

// Initialize Electron App Shell

const initShell = () => {

  // Debug Info About the Current Electron App
  // console.log("App Name: ", app.getName());
  // console.log("App Path: ", app.getAppPath());
  // console.log("App Version: ", app.getVersion());

  // ------------------------------------
  // Set Application Values Globally for React App
  // They are available...
  // ------------------------------------
  global.configPath = app.getPath('userData');
  global.appVersion = packageDetails.version;

  // ------------------------------------
  // Set Up  Renderer (Browser-side) Events Listeners
  // For Creating Windows
  // TODO: refactor these into one function
  // ------------------------------------
  ipcMain.on('new-window', createNewWindow);
  ipcMain.on('about-window', createNewWindow);

  // ------------------------------------
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Set Application Menu
  // Open Application Window
  // To Begin App Experience
  // ------------------------------------
  app.on('ready', () => {
    Menu.setApplicationMenu(menuConfig.createMenu());
    createWindow();
  });

  // Quit Application when all windows are closed.
  app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // Open Application Window on Dock Icon Click
  app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (getMainWindow() === null) {
      createWindow();
    }
  });
};

initShell();



