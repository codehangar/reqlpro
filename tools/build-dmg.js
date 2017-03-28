const appdmg = require('appdmg');
const packageConfig = require('../package.json');
const path = require('path');

const projectRoot = path.join(__dirname, '../..');
const target = path.join(projectRoot, 'apps/ReQLPro_' + packageConfig.version + '.dmg');

const ee = appdmg({
  target: target,
  basepath: projectRoot,
  specification: {

    // The title of the produced DMG, which will be shown when mounted
    "title": "ReQLPro_" + packageConfig.version,

    // Path to your icon, which will be shown when mounted
    "icon": "app/images/reqlpro.icns",

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
        "path": "apps/ReQLPro-darwin-x64/ReQLPro.app"
      }

    ]
  }
});

ee.on('progress', function(info) {
  console.log("info", info)

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
  console.log("err", err)
  // An error occurred
});
