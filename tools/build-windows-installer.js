var electronInstaller = require('electron-winstaller');
var package = require('../package.json');

resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: '../apps/ReQLPro-win32-x64',
  authors: 'Code Hangar, Inc.',
  exe: 'ReQLPro_' + package.version + '.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
