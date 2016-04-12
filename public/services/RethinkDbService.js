var r = window.nodeRequire('rethinkdb'),
	co = window.nodeRequire('co'),
	uuid = window.nodeRequire('node-uuid');

var RethinkDbService = function() {

};

/**
 * Generate a RethinkDB client connection
 * @returns {Promise}
 */
RethinkDbService.prototype.getConnection = function(host, port, authkey) {
	var connectionInfo = {
        host: host || process.env.DATABASE_HOST,
        port: port || process.env.DATABASE_PORT,
        authKey: authkey || process.env.DATABASE_KEY
    };
	return new Promise(function(resolve, reject) {
	    r.connect(connectionInfo).then(function(conn) {
	    	// conn.on('close', function() {
	    	// 	console.log('closed a database connection');
	    	// });
	        resolve(conn);
	    }).catch(function(err) {
	        reject(err);
	    });
	});
};

/**
 * Generate a RethinkDB database connection
 * @returns {Promise}
 */
RethinkDbService.prototype.getDatabaseConnection = function() {
	var connectionInfo = {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        authKey: process.env.DATABASE_KEY,
        db: process.env.DATABASE_NAME
    };
	return new Promise(function(resolve, reject) {
	    r.connect(connectionInfo).then(function(conn) {
	    	// console.log('opening a database connection');
	    	// conn.on('close', function() {
	    	// 	console.log('closed a database connection');
	    	// });
	        resolve(conn);
	    }).catch(function(err) {
	        reject(err);
	    });
	});
};

/**
 * Generate a RethinkDB authkey
 * @returns {Promise}
 */
RethinkDbService.prototype.generateAuthKey = function() {
	var connectionInfo = {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT
    };
    var authKey = uuid.v4();
	return new Promise(function(resolve, reject) {
	    r.connect(connectionInfo).then(function(conn) {
	    	r.db('rethinkdb').table('cluster_config').get('auth').update({auth_key: authKey}).run(conn, function(err, results) {
				if(err) {
					console.log(err);
					reject(err);
				} else {
					console.log('New authkey has been generated and set!');
					console.log('Add the following key to the respective Environment');
					console.log(authKey);
					conn.close();
					resolve(true);
				}
	    	});
	    }).catch(function(err) {
	        reject(err);
	    });
	});
};

/**
 * Generate a RethinkDB authkey
 * @returns {Promise}
 */
RethinkDbService.prototype.resetAuthKey = function() {
	var connectionInfo = {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        authKey: process.env.DATABASE_KEY
    };
	return new Promise(function(resolve, reject) {
	    r.connect(connectionInfo).then(function(conn) {
	    	r.db('rethinkdb').table('cluster_config').get('auth').update({auth_key: null}).run(conn, function(err, results) {
				if(err) {
					console.log(err);
					reject(err);
				} else {
					console.log('Authkey has been reset back to null, no authKey is required to connect now');
					conn.close();
					resolve(true);
				}
	    	});
	    }).catch(function(err) {
	        reject(err);
	    });
	});
};

/**
 * Create a RethinkDB Database
 * @param {Object} RethinkDb Connection
 * @param {String} Database Name
 * @returns {Promise}
 */
RethinkDbService.prototype.createDb = function(conn, newDatabase) {
	return new Promise(function(resolve, reject) {
		r.dbList().run(conn, function(err, results) {
			if(err) {
				console.log(err);
				reject(err);
			} else {
				if(results.indexOf(newDatabase) === -1) {
					// Lets create the new db
					r.dbCreate(newDatabase).run(conn, function(err, results) {
						console.log(newDatabase + ' was successfully created.');
						resolve(newDatabase + ' was successfully created.');
					});
				} else {
					resolve(newDatabase + ' already exists.');
				}
			}
		});
	});
};

/**
 * Create a RethinkDB Table
 * @param {Object} RethinkDb Connection
 * @param {String} Database Name
 * @param {String} Table Name
 * @returns {Promise}
 */
RethinkDbService.prototype.createTable = function(conn, database, newTable, primaryKey) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			// Get a list of database tables
			var dblist = yield r.db(database).tableList().run(conn);
			// If tables do not exist in dblist array then create the tables
			if(dblist.indexOf(newTable) === -1) {
				yield r.db(database).tableCreate(newTable, {primaryKey: primaryKey}).run(conn);
				console.log(newTable + ' was successfully created.');
				resolve(newTable + ' was successfully created.');
			} else {
				console.log(newTable + ' already existed.');
				resolve(newTable + ' already existed.');
			}

		}).catch(function(err) {
			reject('Failed creating the table: ' + newTable);
		});
	});
};

/**
 * Create a RethinkDB Index
 * @param {Object} RethinkDb Connection
 * @param {String} Table Name
 * @param {String} Index Name
 * @returns {Promise}
 */
RethinkDbService.prototype.createIndex = function(conn, database, table, newIndex) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			// Get a list of indices on a table
			var indexList = yield r.db(database).table(table).indexList().run(conn);
			// If index does not exist in indexList array then create the index
			if(indexList.indexOf(newIndex) === -1) {
				yield r.db(database).table(table).indexCreate(newIndex).run(conn);
				console.log(newIndex + ' index on table ' + table + ' was created successfully.');
				resolve(newIndex + ' index on table ' + table + ' was created successfully.');
			} else {
				console.log(newIndex + ' index on table ' + table + ' already existed.');
				resolve(newIndex + ' index on table ' + table + ' already existed.');
			}

		}).catch(function(err) {
			reject('Failed creating the index: ' + newIndex + ' on the table: ' + table);
		});
	});
};

/**
 * Get a list of databases
 * @param {Object} RethinkDb Connection
 * @returns {Promise}
 */
RethinkDbService.prototype.getDbList = function(conn) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			var dbList = yield r.dbList().run(conn);
			resolve(dbList);
		}).catch(function(err) {
			reject(err);
		});
	});
};

/**
 * Get a list of tables for a database
 * @param {Object} RethinkDb Connection
 * @param {String} Database name
 * @returns {Promise}
 */
RethinkDbService.prototype.getTableList = function(conn, db) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			var tableList = yield r.db(db).tableList().run(conn);
			resolve(tableList);
		}).catch(function(err) {
			reject(err);
		});
	});
};

/**
 * Get table data
 * @param {Object} RethinkDb Connection
 * @param {String} Database name
 * @param {String} Table name
 * @returns {Promise}
 */
RethinkDbService.prototype.getTableData = function(conn, db, table) {
	return new Promise(function(resolve, reject) {
		co(function *() {
			var tableList = yield r.db(db).table(table).run(conn);
			resolve(tableList);
		}).catch(function(err) {
			reject(err);
		});
	});
};

module.exports = new RethinkDbService();
