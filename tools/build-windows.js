const electronPackager = require('electron-packager');
const electronInstaller = require('electron-winstaller');
const DIR = require('./build-paths');
const packageConfig = require('../package.json');

electronPackager({
  dir: DIR.BUILDS,
  name: packageConfig.productName,
  appVersion: packageConfig.version,
  electronVersion: packageConfig.devDependencies.electron,
  out: DIR.APPS,
  asar: true,
  overwrite: true,
  platform: 'win32',
  arch: 'x64',
  icon: DIR.ICO_FILE,
  win32metadata: {
    CompanyName: 'Code Hangar, Inc.',
    FileDescription: packageConfig.productName,
    ProductName: packageConfig.productName,
    InternalName: packageConfig.productName,
  }
}, (err, appPaths) => {
  if (err) {
    throw new Error(err);
  } else if (appPaths[0]) {
    console.log('appPaths', appPaths);

    electronInstaller.createWindowsInstaller({
      appDirectory: appPaths[0],
      outputDirectory: DIR.APPS,
      authors: 'Code Hangar, Inc.',
      exe: 'ReQLPro.exe',
      iconUrl: DIR.ICO_FILE,
      setupIcon: DIR.ICO_FILE,
      setupExe: 'ReQLPro_' + packageConfig.version + '_Setup.exe',
      setupMsi: 'ReQLPro_' + packageConfig.version + '_Setup.msi'
    }).then(() => {
      console.log('It worked!')
    }).catch((e) => {
      console.log(`No dice: ${e.message}`)
    });
  }
});
