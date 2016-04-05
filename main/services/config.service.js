const electron = require('electron');
// Module to control application life.
const app = electron.app;
const fs = require('fs');

var ConfigService = function() {
  this.configPath = app.getPath('userData');
  this.configFileName = 'config.json';
  this.fullConfigPath = this.configPath + '/' + this.configFileName;
};

ConfigService.prototype.readConfigFile = function() {
  return new Promise((resolve, reject) => {
    fs.readFile(this.fullConfigPath, {
      encoding: 'utf-8'
    }, (err, data) => {
        if(err) {
          console.log(err);
          var data = {
            favorites: []
          };
          if(err.errno === -2) {
            resolve(this.writeConfigFile(data));
          }
        } else {
          // Data is a string at this point
          resolve(data);
        }
    });
  });
};

ConfigService.prototype.writeConfigFile = function(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(this.fullConfigPath, JSON.stringify(data), (err) => {
        if(err) {
          console.log(err);
          resolve(null);
        } else {
          resolve(data);
        }
    });
  });
};

module.exports = new ConfigService();