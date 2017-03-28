'use strict';

const { createNewWindow, launchFeedbackPopup } = require('./main.electron-utils.js');
const { Menu, shell } = require('electron');

function createMenu() {

  // Menu Option
  let quitMenuOption = {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+W',
    selector: 'terminate:',
    role: 'close'
  };

  // Menu Option Alternative
  if (process.platform === 'darwin') {
    quitMenuOption = {
      label: 'Quit',
      accelerator: 'Cmd+Q',
      selector: 'terminate:'
    }
  }

  // Submenus
  const mainSubMenu = {
    label: 'ReqlPro (Beta)',
    submenu: [
      {
        label: 'About ReqlPro (Beta)',
        click: function() {
          createNewWindow('new-window', {
            path: '/about.html',
            width: 300,
            height: 200
          });
        }
      },
      {
        label: 'New Window',
        accelerator: 'Command+N',
        click: function() {
          createNewWindow('new-window', {});
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
          shell.openExternal('http://reqlpro.com/support');
        }
      },
      {
        label: 'Feedback',
        click: function() {
          launchFeedbackPopup();
          // HS.beacon.open();
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
