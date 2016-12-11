// import RethinkDbService from '../main/services/rethinkdb.service';
const RethinkDbService = require('../main/services/rethinkdb.service');

export function getDbConnection(connection) {
  return dispatch => {
    new Promise((resolve, reject) => {
      RethinkDbService.getConnection(connection.host, connection.port, connection.authKey).then((conn) => {

        dispatch({
          type: 'SET_DB_CONNECTION',
          dbConnection: conn
        });

        dispatch(getDbList(conn));

        resolve(conn);
      }).catch(error => {
        dispatch({
          type: 'SET_DB_CONNECTION',
          dbConnection: error
        });
      });
    });
  }
};

export function getDbList(dbConnection) {
  return dispatch => {
    new Promise((resolve, reject) => {
      RethinkDbService.getDbList(dbConnection).then(function(dblist) {
        var databases = [];
        for (var i = 0; i < dblist.length; i++) {
          databases.push({
            name: dblist[i],
            tables: []
          });
        }
        dispatch({
          type: 'SET_DB_LIST',
          databases: databases
        });
        resolve(dblist);
      }).catch(function(err) {
        console.log('getDbList error', err)
        dispatch({
          type: 'SET_DB_LIST',
          databases: err
        });
      });
    });
  }
}

export function getDbTables(dbConnection, database) {
  return dispatch => {
    new Promise((resolve, reject) => {
      RethinkDbService.getTableList(dbConnection, database.name).then(function(tables) {

        dispatch({
          type: 'SET_DB_TABLES',
          database,
          tables
        });

        resolve(tables);
      }).catch(function(err) {
        console.log('getTableList error', err)
        dispatch({
          type: 'SET_DB_TABLES',
          tables: err
        });
      });
    });
  }
}

export function createDatabase(dbConnection, database) {
  return dispatch => {
    new Promise((resolve, reject) => {
      RethinkDbService.createDb(dbConnection, database.name).then(function(results) {

        const newDb = {
          name: database.name,
          tables: []
        }

        dispatch({
          type: 'ADD_TO_DB_LIST',
          database: newDb,
        });

        resolve(results);
      }).catch(function(err) {
        console.log('createDb error', err)
        dispatch({
          type: 'ADD_TO_DB_LIST',
          database: err,
        });
      });
    });
  }
}

export function createTable(dbConnection, selectedDatabase, table) {
  return dispatch => {
    new Promise((resolve, reject) => {
      RethinkDbService.createTable(dbConnection, selectedDatabase.name, table.name, 'id').then((results) => {

        // Add table to selectedDatabase list
        const newTable = { name: tableName };
        // this.toggleEntityForm();

        dispatch({
          type: 'ADD_TO_TABLE_LIST',
          table: newTable,
        });

        resolve(results);
      }).catch(function(err) {
        console.log('createDb error', err)
        dispatch({
          type: 'ADD_TO_DB_LIST',
          database: err,
        });
      });
    });
  }
}
