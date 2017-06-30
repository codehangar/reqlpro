'use strict';

const { BrowserWindow } = require('electron');
const path = require('path');
const appRoot = path.join(__dirname, '..');
const packageJSON = require('./../package.build.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function getMainWindow() {
  return mainWindow;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    'min-width': 600,
    'min-height': 400,
    backgroundColor: '#073642',
  });

  mainWindow.setTitle(packageJSON.productName + ' (' + packageJSON.version + ')');

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3001/index.html');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('file://' + appRoot + '/dist/index.html');
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// Create new window instances
function createNewWindow(event, config) {
  let win = new BrowserWindow({
    width: config.width || 1000,
    height: config.height || 700,
    show: true
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3001' + (config.path || '/index.html'));
    win.webContents.openDevTools();
  } else {
    win.loadURL('file://' + appRoot + '/dist' + (config.path || '/index.html'));
  }

  win.on('closed', function() {
    win = null;
  });
}

function launchFeedbackPopup() {
  mainWindow.webContents.send('launchFeedbackPopup');
}

module.exports = {
  createWindow,
  createNewWindow,
  getMainWindow,
  launchFeedbackPopup
};
