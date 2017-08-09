const electronPackager = require('electron-packager');
const fs = require('fs');
const archiver = require('archiver');
const DIR = require('./build-paths');
const path = require('path');

const packageConfig = require('../package.json');

const linuxFileOut = path.join(DIR.APPS, 'ReQLPro_' + packageConfig.version + '-linux-x64.zip');

electronPackager({
  dir: DIR.BUILDS,
  name: packageConfig.productName,
  appVersion: packageConfig.version,
  out: DIR.APPS,
  asar: true,
  overwrite: true,
  platform: 'linux',
  arch: 'x64',
  icon: DIR.ICO_FILE
}, (err, appPaths) => {
  if (err) {
    throw new Error(err);
  } else if (appPaths[0]) {
    console.log('appPaths', appPaths);

    function archiveDirectory (outputFile, sourceDir) {
      // create a file to stream archive data to.
      const output = fs.createWriteStream(outputFile);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });

      // listen for all archive data to be written
      output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
      });

      // good practice to catch this error explicitly
      archive.on('error', function (err) {
        throw err;
      });

      // pipe archive data to the file
      archive.pipe(output);

      // append files from a directory
      archive.directory(sourceDir, 'ReQLPro');

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      archive.finalize();
    }

    archiveDirectory(linuxFileOut, appPaths[0]);
  }
});
