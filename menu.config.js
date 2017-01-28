'use strict';

function createMenu() {
  // const { ipcRenderer, Menu, BrowserWindow, app } = require('electron');
  const ipc = require('ipc-renderer');
  const Menu = require('electron').Menu;

  let quitMenuOption = {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+W',
    selector: 'terminate:',
    role: 'close'
  };

  if (process.platform === 'darwin') {
    quitMenuOption = {
      label: 'Quit',
      accelerator: 'Cmd+Q',
      selector: 'terminate:'
    }
  }

  const mainSubMenu = {
    label: 'ReqlPro (Beta)',
    submenu: [
      {
        label: 'About ReqlPro (Beta)',
        click: function() {
          ipc.send('new-window', {
            path: '/dev/about.html',
            width: 300,
            height: 200
          });
        }
      },
      {
        label: 'New Window',
        accelerator: 'Command+N',
        click: function() {
          ipc.send('new-window', {});
        }
      },
      {
        label: 'Hide ReqlPro',
        accelerator: 'Command+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
    ]
  };
  const editSubMenu = {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }
    ]
  };
  const windowWubMenu = {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }
    ]
  };
  const helpSubMenu = {
    label: 'Help',
    submenu: [
      {
        label: 'Help Center',
        click: function() {
          window.nodeRequire('electron').shell.openExternal('http://utils.codehangar.io/rethink/support')
        }
      },
      {
        label: 'Feedback',
        click: function() {
          HS.beacon.open();
        }
      }
    ]
  };

  const template = [mainSubMenu, editSubMenu, windowWubMenu, helpSubMenu];

  mainSubMenu.submenu.push(quitMenuOption);

  return Menu.buildFromTemplate(template);
}

module.exports = {
  createMenu: createMenu
};
