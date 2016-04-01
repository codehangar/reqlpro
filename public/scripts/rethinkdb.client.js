var util = require("util");
var EventEmitter = require("events").EventEmitter;
var RethinkDbService = window.nodeRequire('./services/RethinkDbService');
var identicon = window.nodeRequire('identicon');

var RethinkDbClient = function() {
	EventEmitter.call(this); // Inherit constructor
	this.router = {
		connectionForm: {
			show: false
		}
	};
	this.connection = null;
	this.favorites = [{
		name: "local",
		host: "192.168.99.100",
		port: "32780", 
		database: "",
		authKey: "",
		identicon: "iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAABmJLR0QA/wD/AP+gvaeTAAACdElEQVRYhcWXzW/TQBDF39pO7dj5aJOWKjRSJaQCFyQqgdpjTwjx/4KqnrigFJCACxKIG0obgZ2kSZpPxx5OCXZ2k64Tr/pueZ6xfnJm92lACwqJ6NONt2jPVFv2IEn95Y1HAYWcryEiAnDhNfCz34NK/er3cO42EIJi/hxmBvKj31UKMgca8EDafYAsA9LuC0QEZHztttDyJ3iwZc0LikZG2BgQ6U1/zPmObsDRDWmAUmYLOmPz352pj2/dNhgR0Yq+mAj4eOE1Tha/4kmxjNPtXVHLJYBT2fdrd5f8FwPo1W4FT51CkjZpJYIBAAZAFVBiGEAdkPzULWgGlKYYEdUS1HsAYpNKALsaD5yqad/K1gNgDAi56jSyRrY+JKJz95q8yUhYvNbMrCOZy3XtmWn6Y9RHQ86vWlmUM2ZikI1g6qMh3rf+cP5ZaT8GkyRulP5NBLAkuSf8MsMwwPfbDucfmLZTMS1Bh1i/R/1cTjfwolCK+VlNl4cZBFN8aLsx78jO47iwM5AmAXBoOb1Dy5Gul5qZIzuP13sVaGDSobqO7oSJgMT8qpXFWWmfq69aWTUwy0AAoJwxuSO8qZaeplUgqiTMpoBI1xkLASzOCJc1AFAfD3IHpt1nkvVLlUY21douvf17JdqFEmVZapeeaPVIqlRv4E2BUo+DTYCUZNMMCEh2FI0v3Ra3WxeNDN7sPZR+ybP8Nh7ZOc4PAGEKvXOv0Zn6Me+Jk4dxXCjBnYxjyRrIr1IAVi5xgchs+RNEl8EjO4/nhR1oKlcPGUUvVw1QuwvJggCRbIquHu6E36dVg8RgokCfO02lII+dPF4Wy9xR+wdpp5NbNm65kQAAAABJRU5ErkJggg=="
	}];
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
    _this.selectedFavorite = favorite;
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
RethinkDbClient.prototype.toggleConnectionForm = function() {
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
	    identicon: buffer.toString('base64')
	  });
	  _this.emit('addFavorite');
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

module.exports = new RethinkDbClient();