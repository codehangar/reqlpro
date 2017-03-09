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

const AnonId = function(configPath) {
  if (!configPath) throw new Error('AnonId must supplied a path to the configuration');
  this.configPath = configPath;
  this.configFileName = 'anon-id.json';
  this.fullAnonIdPath = this.configPath + '/' + this.configFileName;

  this.anonId = null;
  this.get = () => {
    if (!this.anonId) {
      this.anonId = this.readAnonIdFile();
    }
    return this.anonId;
  };
};

AnonId.prototype.readAnonIdFile = function() {
  return new Promise((resolve, reject) => {
    fs.readFile(this.fullAnonIdPath, {
      encoding: 'utf-8'
    }, (err, data) => {
      if (err) {

        resolve(this.writeAnonIdFile());

        // TODO: Research File not found errors
        // This works on mac, but not windows
        if (err && err.errno === -2) {
        }
      } else if (!data) {
        resolve(this.writeAnonIdFile());
      } else {
        resolve(data);
      }
    });
  });
};

AnonId.prototype.writeAnonIdFile = function() {
  return new Promise((resolve, reject) => {
    const uuid = UUID.generate();
    fs.writeFile(this.fullAnonIdPath, uuid, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(uuid);
      }
    });
  });
};

const service = configPath => {

  if (global.configPath) {
    return new AnonId(global.configPath)
  } else {
    return new AnonId(remote.getGlobal('configPath'));
  }

};

module.exports = new service();
