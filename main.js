'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module to manage config files
const ConfigService = require('./main/services/config.service.js');
// Module to use generators to handle async code better
const co = require('co');
// Communication between main and renderer
const ipcMain = require('electron').ipcMain;
const Menu = require('electron').Menu;
const menuConfig = require('./menu.config');

const packageDetails = require('./package.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  co(function*() {
    const userConfig = yield ConfigService.readConfigFile();
    console.log("---> userConfig", userConfig)
    global.userConfig = JSON.stringify(userConfig);

    global.appVersion = packageDetails.version;
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1600,
      height: 1200,
      'min-width': 600,
      'min-height': 400
    });

    // Setup file save events
    ipcMain.on('writeConfigFile', function(event, args) {
      co(function*() {
        const userConfig = yield ConfigService.writeConfigFile(args);
        global.userConfig = JSON.stringify(userConfig);
      }).catch(function(err) {
        console.error(err);
      });
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/dev/index.html');

    // Open the DevTools (if dev flag is passed)
    if (process.argv.indexOf('--dev') > 1) {
      // Open the DevTools.
      mainWindow.webContents.openDevTools();
    }

    Menu.setApplicationMenu(menuConfig.createMenu());

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  }).catch(function(err) {
    console.error(err);
  });
}

// Create new window instances
function createNewWindow(event, config) {
  var win = new BrowserWindow({
    width: config.width || 1000,
    height: config.height || 700,
    show: true
  });
  win.loadURL('file://' + __dirname + (config.path || '/dev/index.html'));

  // Open the DevTools (if dev flag is passed)
  if (process.argv.indexOf('--dev') > 1) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  win.on('closed', function() {
    win = null;
  });
}

ipcMain.on('new-window', createNewWindow);

// Open About Info Window

ipcMain.on('about-window', createNewWindow);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

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
  if (mainWindow === null) {
    createWindow();
  }
});


