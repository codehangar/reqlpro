const RethinkDbService = require('../../../../../services/rethinkdb.service');
import * as types from '../../../../../action-types';
import { queryTable } from '../../../../../actions';

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
        const selectedTable = dispatch({
          type: 'SET_SELECTED_TABLE',
          dbName,
          tableName
        });
        if (selectedTable){
          dispatch(queryTable(dbConnection, dbName, tableName, selectedTable.query));
        } else {
          dispatch(queryTable(dbConnection, dbName, tableName));
        }

        resolve(results);
      }).catch(error => {
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: true
        });
        reject(error);
      });
    });
  }
}

export function deleteTable(conn, dbName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'SET_CONNECTION_LOADING',
        loading: true
      });
      RethinkDbService.deleteTable(conn, dbName, tableName).then((results) => {
        dispatch({
          type: types.DELETE_TABLE,
          dbName,
          tableName
        });
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        resolve();
      }).catch((err) => {
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        reject(err);
      });
    });
  }
}
