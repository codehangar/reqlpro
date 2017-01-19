const RethinkDbService = require('../../../../main/services/rethinkdb.service');
import * as types from '../../../action-types';

export function getDbList(dbConnection) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.getDbList(dbConnection).then(dbList => {
        const databases = dbList.map((dbName) => {
          return { name: dbName };
        });
        dispatch({
          type: types.SET_DB_LIST,
          databases: databases
        });
        resolve(dbList);
      }).catch(error => {
        reject(error);
      });
    });
  }
}

export function createDatabase(dbConnection, dbName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.createDb(dbConnection, dbName).then(function(results) {
        dispatch({
          type: types.ADD_TO_DB_LIST,
          database: {
            name: dbName
          }
        });
        dispatch({ type: types.TOGGLE_DATABASE_FORM });
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
