const fs = require('fs');
const archiver = require('archiver');
const packageConfig = require('../package.json');
const path = require('path');

function archiveDirectory(outputFile, sourceDir) {
  // create a file to stream archive data to.
  const output = fs.createWriteStream(outputFile);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // listen for all archive data to be written
  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  // append files from a directory
  archive.directory(sourceDir);

  // finalize the archive (ie we are done appending files but streams have to finish yet)
  archive.finalize();
}

const appsRoot = path.join(__dirname, '../../apps');
const linuxFile = path.join(appsRoot, 'ReQLPro_' + packageConfig.version + '-win32-x64.zip');
const linuxSrc = path.join(appsRoot, 'ReQLPro-win32-x64/');
const winFile = path.join(appsRoot, 'ReQLPro_' + packageConfig.version + '-linux-x64.zip');
const winSrc = path.join(appsRoot, 'ReQLPro-linux-x64/');

archiveDirectory(linuxFile, linuxSrc);
archiveDirectory(winFile, winSrc);
