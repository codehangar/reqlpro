const UUID = require('./uuid.service');
const { remote } = require('electron');
const fs = require('fs');

/**
 * https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname
 *
 * appData Per-user application data directory, which by default points to:
 *  - %APPDATA% on Windows
 *  - $XDG_CONFIG_HOME or ~/.config on Linux
 *  - ~/Library/Application Support on macOS
 * userData The directory for storing your app's configuration files,
 * which by default it is the appData directory appended with your app's name.
 */



// given the config path,
// export default function AnonId(configPath) {
//   if (!configPath) throw new Error('AnonId must supplied a path to the configuration');
//   // this.configPath = configPath;
//   // this.configFileName = 'anon-id.json';
//   // this.fullAnonIdPath = this.configPath + '/' + this.configFileName;
//   // this.get = getAnonId;
// };

export const getAnonId = (configPath) => {
  if (!configPath) throw new Error('AnonId must supplied a path to the configuration');
    // if (!this.anonId) {
  //     this.anonId = this.readAnonIdFile();
  //   }
  const uuid = UUID.generate();
    return uuid;
};


const readAnonIdFile = function() {
  return new Promise((resolve, reject) => {
    fs.readFile(this.fullAnonIdPath, {
      encoding: 'utf-8'
    }, (err, data) => {
      if (err) {
        resolve(writeAnonIdFile());
//         // TODO: Research File not found errors
//         // This works on mac, but not windows
//         if (err && err.errno === -2) {
//         }
//         ;
      } else if (!data) {
        resolve(writeAnonIdFile());
      } else {
        resolve(data);
      }
    });
  });
};

const writeAnonIdFile = function() {
  return new Promise((resolve, reject) => {

    fs.writeFile(this.fullAnonIdPath, uuid, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(uuid);
      }
    });
  });
};

// if (global.configPath) {
//   return AnonId.get(global.configPath)
// } else {
//   return AnonId.get(remote.getGlobal('configPath'));
// }

