const electron = require('electron');
// Module to control application life.
const app = electron.app;
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

var ConfigService = function() {
  this.name = app.getName();
  this.configPath = app.getPath('userData');
  this.configFileName = 'config.json';
  this.fullConfigPath = this.configPath + '/' + this.configFileName;

  console.log("this.name", this.name);
  console.log("app.getAppPath()", app.getAppPath());
  console.log("app.getVersion()", app.getVersion());
  console.log("this.fullConfigPath", this.fullConfigPath);
  // app.dock.bounce();
  // app.dock.setBadge('text')
};

ConfigService.prototype.readConfigFile = function() {
  return new Promise((resolve, reject) => {
    fs.readFile(this.fullConfigPath, {
      encoding: 'utf-8'
    }, (err, data) => {
      console.log(" ***readConfigFile", data)
      if (err) {
        console.error(err);
        var data = {
          favorites: []
        };
        resolve(this.writeConfigFile(data));

        // TODO: Research File not found errors
        // This works on mac, but not windows
        if (err.errno === -2) {}
      } else {
        // Data is a string at this point
        resolve(data);
      }
    });
  });
};

ConfigService.prototype.writeConfigFile = function(data) {
  console.log(" ***writeConfigFile", data)
  return new Promise((resolve, reject) => {
    fs.writeFile(this.fullConfigPath, JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        resolve(JSON.stringify(data));
      }
    });
  });
};

module.exports = new ConfigService();
