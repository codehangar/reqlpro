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

export const getAnonId = (configPath) => {
  if (!configPath) throw new Error('AnonId must supplied a path to the configuration');
  return readAnonIdFile(configPath).then((data) => {
    if (data) {
      return data;
    }else if(!data){
      const uuid = UUID.generate();
      setAnonId(configPath, uuid);
      return  uuid;
    }
  })
};

export const setAnonId = (configPath, uuid) => {
  //never overwrite
  return readAnonIdFile(configPath).then((data) => {
    if (data) {
      return data;
    }else if(!data){
      return writeAnonIdFile(configPath, uuid).then(data =>{
        return data;
      })
    }
  })
};

const readAnonIdFile = function(configPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(configPath, { encoding: 'utf-8' }, (err, data) => {
      resolve(data);
//       if (err) {
//         resolve(writeAnonIdFile());
// //         // TODO: Research File not found errors
// //         // This works on mac, but not windows
// //         if (err && err.errno === -2) {
// //         }
// //         ;
//       } else if (!data) {
//         resolve()
//         // resolve(writeAnonIdFile());
//       } else {
//         resolve(data);
//       }
    });
  });
};

const writeAnonIdFile = function(path, uuid) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, uuid, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(uuid);
      }
    });
  });
};
