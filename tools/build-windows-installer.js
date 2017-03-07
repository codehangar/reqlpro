const electronInstaller = require('electron-winstaller');
const packageConfig = require('../package.json');

resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: '../apps/ReQLPro-win32-x64',
  outputDirectory: '../apps',
  authors: 'Code Hangar, Inc.',
  exe: '../apps/ReQLPro_' + packageConfig.version + '.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
