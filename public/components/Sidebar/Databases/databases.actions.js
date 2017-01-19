const RethinkDbService = require('../../../../main/services/rethinkdb.service');

export function getDbList(dbConnection) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.getDbList(dbConnection).then(dbList => {
        const databases = dbList.map((dbName) => {
          return { name: dbName };
        });
        dispatch({
          type: 'SET_DB_LIST',
          databases: databases
        });
        resolve(dbList);
      }).catch(error => {
        reject(error);
      });
    });
  }
}

export function createDatabase(dbConnection, databaseName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.createDb(dbConnection, databaseName).then(function(results) {
        dispatch({
          type: 'ADD_TO_DB_LIST',
          database: {
            name: databaseName
          }
        });
        dispatch({ type: 'TOGGLE_DATABASE_FORM' });
        resolve(results);
      }).catch(error => {
        // dispatch({
        //   type: 'ADD_TO_DB_LIST',
        //   database: error,
        // });
        reject(error);
      });
    });
  }
}
