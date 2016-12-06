// import RethinkDbService from '../main/services/rethinkdb.service';
const RethinkDbService = require('../main/services/rethinkdb.service');

export function getDbConnection(connection) {
  return dispatch => {
    new Promise((resolve, reject) => {
      // console.log('connection', connection);
      RethinkDbService.getConnection(connection.host, connection.port, connection.authKey).then((conn) => {
        console.log('getConnection conn', conn);

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
        console.log('getDbList success, databases', databases)
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
  console.log("getDbTables database", database)
  return dispatch => {
    new Promise((resolve, reject) => {
      RethinkDbService.getTableList(dbConnection, database.name).then(function(tables) {
        
        console.log("DISPACTING! database", database)
        console.log("DISPACTING! tables", tables)
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
