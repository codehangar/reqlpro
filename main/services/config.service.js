const electron = require('electron');
// Module to control application life.
const app = electron.app;
const fs = require('fs');

var ConfigService = function() {
  this.name = app.getName();
  console.log("this.name", this.name)
  this.configPath = app.getPath('userData');
  this.configFileName = 'config.json';
  this.fullConfigPath = this.configPath + '/' + this.configFileName;
};

ConfigService.prototype.readConfigFile = function() {
  return new Promise((resolve, reject) => {
    fs.readFile(this.fullConfigPath, {
      encoding: 'utf-8'
    }, (err, data) => {
        console.log(" ***readConfigFile", data)
        if(err) {
          console.error(err);
          var data = {
            favorites: []
          };
          resolve(this.writeConfigFile(data));

          // TODO: Research File not found errors
          // This works on mac, but not windows
          if(err.errno === -2) {
          }
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
        if(err) {
          console.log(err);
          resolve(null);
        } else {
          resolve(JSON.stringify(data));
        }
    });
  });
};

module.exports = new ConfigService();