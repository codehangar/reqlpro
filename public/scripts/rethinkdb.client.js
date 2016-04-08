var util = require("util");
var EventEmitter = require("events").EventEmitter;
var RethinkDbService = window.nodeRequire('./services/RethinkDbService');
var identicon = window.nodeRequire('identicon');
var ipcRenderer = window.nodeRequire('electron').ipcRenderer;
var Connection = require('../models/Connection');

var RethinkDbClient = function(params) {
	EventEmitter.call(this); // Inherit constructor
	this.router = {
		connectionForm: {
			show: false,
      action: 'Add'
		}
	};
	this.connection = params.connection || null;
	this.favorites = params.favorites || [];
	this.selectedFavorite = {
		databases: [],
		dbConnection: null
	};
	this.selectedTable = null;
};

util.inherits(RethinkDbClient, EventEmitter); // Inherit eventemitter prototype

// Update selected favorite
RethinkDbClient.prototype.updateSelectedFavorite = function(favorite) {
    var _this = this;
    _this.selectedFavorite = JSON.parse(JSON.stringify(favorite));
    _this.selectedFavorite.databases = [];
    RethinkDbService.getConnection(favorite.host, favorite.port, favorite.authKey).then(function(conn) {
      _this.selectedFavorite.dbConnection = conn;
      RethinkDbService.getDbList(conn).then(function(dblist) {
        var databases = [];
        for(var i = 0; i < dblist.length; i++) {
          databases.push({
            name: dblist[i],
            tables: []
          });
        }
        _this.selectedFavorite.databases = databases;
        _this.emit('updateRehinkDbClient');
      }).catch(function(err) {
        console.log(err);
      });
    }).catch(function(err) {
      console.log(err);
    });
};

// Toggle Connection Form
RethinkDbClient.prototype.toggleConnectionForm = function(info) {
  this.connection = Connection.create();
  if(info) {
    // If we pass info lets set data on connection model
    this.connection.name.value = info.name;
    this.connection.port.value = info.port;
    this.connection.host.value = info.host;
    this.connection.database.value = info.database;
    this.connection.authKey.value = info.authKey;
    this.connection.identicon = info.identicon;
    this.connection.index = info.index;
    // Also set form action to edit
    this.router.connectionForm.action = 'Edit';
  } else {
    this.router.connectionForm.action = 'Add';
  }
	this.router.connectionForm.show = !this.router.connectionForm.show;
	this.emit('toggleConnectionForm');
};

// Add favorite
RethinkDbClient.prototype.addFavorite = function(favorite) {
	var _this = this;
	identicon.generate({ id: favorite.name.value, size: 35 }, function(err, buffer) {
    if (err) throw err;
    // buffer is identicon in PNG format.
	  _this.favorites.push({
	    name: favorite.name.value,
	    host: favorite.host.value,
	    port: favorite.port.value,
	    database: favorite.database.value,
	    authKey: favorite.authKey.value,
	    identicon: buffer.toString('base64'),
      index: _this.favorites.length
	  });
	  _this.emit('updateFavorites');
    ipcRenderer.send('writeConfigFile', {
      favorites: _this.favorites
    });
	});
};

// Edit favorite
RethinkDbClient.prototype.editFavorite = function(favorite) {
  var _this = this;
  identicon.generate({ id: favorite.name.value, size: 35 }, function(err, buffer) {
    if (err) throw err;
    // buffer is identicon in PNG format.
    _this.favorites[favorite.index] = {
      name: favorite.name.value,
      host: favorite.host.value,
      port: favorite.port.value,
      database: favorite.database.value,
      authKey: favorite.authKey.value,
      identicon: buffer.toString('base64'),
      index: favorite.index
    };
    // Lets run update selected favorite since thats what we are editing
    if(_this.selectedFavorite.index === favorite.index) {
      _this.updateSelectedFavorite(_this.favorites[favorite.index]);
    }
    _this.emit('updateFavorites');
    ipcRenderer.send('writeConfigFile', {
      favorites: _this.favorites
    });
  });
};

// Edit favorite
RethinkDbClient.prototype.deleteFavorite = function(favorite) {
  console.log(favorite);
  this.favorites.splice(favorite.index, 1);
  // Lets update selected favorite since we just deleted our selected favorite
  if(this.selectedFavorite.index === favorite.index) {
    // If there are any favorites left lets do the first item in array
    if(this.favorites.length) {
      this.updateSelectedFavorite(this.favorites[0]);
    } else {
      // If no favorites lets set to default selectedFavorite object
      this.selectedFavorite = {
        databases: [],
        dbConnection: null
      };
    }
  }
  // We need to loop through and update the index field on all the favorites after a delete
  for(var i = 0; i < this.favorites.length; i++) {
    this.favorites[i].index = i;
  }
  console.log(this.favorites);
  this.emit('updateFavorites');
  ipcRenderer.send('writeConfigFile', {
    favorites: this.favorites
  });
};

// Show Tables
RethinkDbClient.prototype.updateDbTables = function(database) {
	var _this = this;
	// Get table list from rethink service
	return new Promise(function(resolve, reject) {
		RethinkDbService.getTableList(_this.selectedFavorite.dbConnection, database.name).then(function(tableList) {
			// Wipe out previous tables
			database.tables = [];
			// Build up a table object and push to tables array on database
			for(var i = 0; i < tableList.length; i++) {
				database.tables.push({
					name: tableList[i]
				});
			}
			resolve(database);
		}).catch(function(err) {
			console.log(err);
			reject(err);
		});
	});
};

// Update Selected Table
RethinkDbClient.prototype.updateSelectedTable = function(databaseName, tableName) {
	this.selectedTable = {
		databaseName: databaseName,
		tableName: tableName,
		type: 'tree',
		data: []
	};
	this.emit('updateRehinkDbClient');
};

// Get initial table data
RethinkDbClient.prototype.getTableData = function(databaseName, tableName) {
	var _this = this;
	RethinkDbService.getTableData(this.selectedFavorite.dbConnection, databaseName, tableName).then(function(tableData) {
		tableData.toArray().then(function(tableData) {
			_this.selectedTable.data = tableData;
			_this.emit('updateSelectedTable');
		}).catch(function(err) {
			console.log(err);
		});
	}).catch(function(err) {
		console.log(err);
	});
};

module.exports = RethinkDbClient;