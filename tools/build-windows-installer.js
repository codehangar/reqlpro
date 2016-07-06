var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: '../build/ReQLPro-win32-x64',
    authors: 'Code Hangar, Inc.',
    exe: 'ReQLPro.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));