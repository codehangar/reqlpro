const electronPackager = require('electron-packager');
const fse = require('fs-extra');
const spawn = require('child_process').spawn;
const packageConfig = require('../package.json');
const DIR = require('./build-paths');
const path = require('path');

const target = path.join(DIR.APPS, '/ReQLPro_' + packageConfig.version + '.dmg');

electronPackager({
  dir: DIR.BUILDS,
  name: packageConfig.productName,
  appVersion: packageConfig.version,
  electronVersion: packageConfig.devDependencies.electron,
  out: DIR.APPS,
  asar: true,
  overwrite: true,
  platform: 'darwin',
  arch: 'x64',
  icon: DIR.ICNS_FILE
}, (err, appPaths) => {
  if (err) {
    throw new Error(err);
  } else if (appPaths[0]) {
    console.log('appPaths', appPaths);

    fse.removeSync(target);

    console.log('Installing appdmg package...');
    const child = spawn('npm', ['i', 'appdmg@0.4.5'], { cwd: DIR.BASE, shell: true });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', function(code) {
      if (code !== 0) {
        process.exit(code);
      }

      const appdmg = require('appdmg');
      const ee = appdmg({
        target: target,
        basepath: DIR.BASE,
        specification: {

          // The title of the produced DMG, which will be shown when mounted
          "title": "ReQLPro_" + packageConfig.version,

          // Path to your icon, which will be shown when mounted
          "icon": DIR.ICNS_FILE,

          // Path to your background
          "background": "app/images/background.png",

          // Size of all the icons inside the DMG
          "icon-size": 80,

          "contents": [

            // This is the contents of your DMG.

            // Each entry has a position specified by
            // X and Y in the center of its icon.

            // `type: link` creates a link to the specified target
            {
              "x": 600,
              "y": 344,
              "type": "link",
              "path": "/Applications"
            },

            // `type: file` adds a file to the DMG
            {
              "x": 200,
              "y": 344,
              "type": "file",
              "path": path.join(appPaths[0], 'ReQLPro.app')
            }

          ]
        }
      });

      ee.on('progress', function(info) {
        // info.current is the current step
        // info.total is the total number of steps
        // info.type is on of 'step-begin', 'step-end'

        // 'step-begin'
        // info.title is the title of the current step

        // 'step-end'
        // info.status is one of 'ok', 'skip', 'fail'

      });

      ee.on('finish', function() {
        // There now is a `test.dmg` file
      });

      ee.on('error', function(err) {
        // An error occurred
        // console.log("err", err);
        throw new Error(err);
      });
    });
  }
});

