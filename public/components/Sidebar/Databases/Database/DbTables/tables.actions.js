const RethinkDbService = require('../../../../../../main/services/rethinkdb.service');
import * as types from '../../../../../action-types';

export function getDbTables(dbConnection, dbName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.getTableList(dbConnection, dbName).then(tables => {
        dispatch({
          type: types.SET_DB_TABLES,
          dbName,
          tables
        });
        resolve(tables);
      }).catch(error => {
        reject(error);
      });
    });
  }
}

export function createTable(dbConnection, dbName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.createTable(dbConnection, dbName, tableName, 'id').then((results) => {
        dispatch({
          type: types.ADD_TO_TABLE_LIST,
          dbName,
          tableName
        });
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });
  }
}

export function deleteTable(conn, dbName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.deleteTable(conn, dbName, tableName).then((results) => {
        dispatch({
          type: types.DELETE_TABLE,
          dbName,
          tableName
        });
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
