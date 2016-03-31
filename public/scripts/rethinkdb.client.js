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
		authKey: "",
		database: "",
		host: "192.168.99.100",
		name: "local",
		port: "32780"
	}];
	this.selectedFavorite = {
		authKey: "",
		database: "",
		host: "192.168.99.100",
		name: "local",
		port: "32780",
		databases: [],
		dbConnection: null		
	};
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
	identicon.generate({ id: favorite.name.value, size: 40 }, function(err, buffer) {
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

module.exports = new RethinkDbClient();