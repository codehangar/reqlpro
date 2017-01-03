// import RethinkDbService from '../main/services/rethinkdb.service';
const RethinkDbService = require('../main/services/rethinkdb.service');
import ReQLEval from '../main/services/reql-eval.service';
import {convertStringsToDates} from './services/date-type.service'

export function getDbConnection(connection) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.getConnection(connection.host, connection.port, connection.authKey).then((conn) => {

        dispatch({
          type: 'SET_DB_CONNECTION',
          dbConnection: conn
        });

        dispatch(getDbList(conn));

        resolve(conn);
      }).catch(error => {
        console.log('getDbConnection error', connection)
        dispatch({
          type: 'SET_DB_CONNECTION_ERROR',
          connectionError: {
            connection,
            error
          }
        });
        reject(error);
      });
    });
  }
}

export function getDbList(dbConnection) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.getDbList(dbConnection).then(dbList => {
        var databases = [];
        for (var i = 0; i < dbList.length; i++) {
          databases.push({
            name: dbList[i],
            tables: []
          });
        }
        dispatch({
          type: 'SET_DB_LIST',
          databases: databases
        });
        resolve(dbList);
      }).catch(error => {
        // dispatch({
        //   type: 'SET_DB_LIST',
        //   databases: error
        // });
        reject(error);
      });
    });
  }
}

export function getDbTables(dbConnection, database) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.getTableList(dbConnection, database.name).then(tables => {
        dispatch({
          type: 'SET_DB_TABLES',
          database,
          tables
        });
        resolve(tables);
      }).catch(error => {
        // dispatch({
        //   type: 'SET_DB_TABLES',
        //   tables: error
        // });
        reject(error);
      });
    });
  }
}

export function createDatabase(dbConnection, database) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.createDb(dbConnection, database.name).then(function(results) {
        dispatch({
          type: 'ADD_TO_DB_LIST',
          database: {
            name: database.name,
            tables: []
          }
        });
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

export function createTable(dbConnection, database, table) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.createTable(dbConnection, database.name, table.name, 'id').then((results) => {
        // Add table to selectedDatabase list
        dispatch({
          type: 'ADD_TO_TABLE_LIST',
          table: {
            name: table.name
          },
          database
        });
        resolve(results);
      }).catch(error => {
        // dispatch({
        //   type: 'ADD_TO_TABLE_LIST',
        //   table: error,
        // });
        reject(error);
      });
    });
  }
}

// export function queryTable(queryParams = selectedTable.query) {
// Todo: pull from passed in queryParams or default to selectedTable on state (or leave as is, not sure)
export function queryTable(dbConnection, databaseName, tableName, queryParams = {
  page: 1,
  limit: 5,
  sort: 'id',
  direction: 0 // ASC = 1, DESC = 0
}) {
  if (queryParams.page) {
    return getTableData(queryParams.sort, queryParams.direction, queryParams.limit, queryParams.page, dbConnection, databaseName, tableName);
  } else if (queryParams.index) {
    return getTableDataBetween(queryParams.index, queryParams.start, queryParams.end, dbConnection, databaseName, tableName);
  }
}

function getTableData(sort, direction, limit, page, dbConnection, databaseName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const conn = dbConnection;
      const db = databaseName;
      const table = tableName;

      if (page < 1) {
        page = 1;
      }

      RethinkDbService.getTableData(conn, db, table, sort, direction, limit, page).then((result) => {
        dispatch({
          type: 'UPDATE_SELECTED_TABLE',
          lastResult: result,
          // data: Object.keys(result.value).map(key => result.value[key]),//convert to array
          data: result.value,
          loading: false
        });
        dispatch(getTableSize(conn, db, table));

        // result.value.toArray().then((tableData) => {
        //     dispatch({
        //       type: 'UPDATE_SELECTED_TABLE',
        //       lastResult: result,
        //       data: tableData,
        //       loading: false
        //     });
        // }).catch(function(err) {
        //   console.error(err);
        //   dispatch({
        //       type: 'UPDATE_SELECTED_TABLE',
        //       lastResult: err,
        //       data: err,
        //       loading: false
        //     });
        // });
        resolve(result);

      }).catch(error => {
        // dispatch({
        //   type: 'UPDATE_SELECTED_TABLE',
        //   lastResult: error,
        //   data: error,
        //   loading: false
        // });
        reject(error);
      });
    });
  }
}

function getTableDataBetween(index, start, end, dbConnection, databaseName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const conn = dbConnection;
      const db = databaseName;
      const table = tableName;

      RethinkDbService.getTableDataBetween(conn, db, table, index, start, end).then((result) => {
        // this was in the old function before refactor, not sure what its for -Cassie
        if (end) {
          result.value.reverse();
        }

        dispatch({
          type: 'UPDATE_SELECTED_TABLE',
          lastResult: result,
          // data: Object.keys(result.value).map(key => result.value[key]),//convert to array
          data: result.value,
          loading: false
        });
        dispatch(getTableSize(conn, db, table));

        resolve(result);

      }).catch(function(error) {
        // dispatch({
        //   type: 'UPDATE_SELECTED_TABLE',
        //   lastResult: error,
        //   data: error,
        //   loading: false
        // });
        reject(error);
      });
    });
  }
}

export function deleteDatabase(conn, dbName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.deleteDb(conn, dbName).then((results) => {
        dispatch({
          type: "DELETE_DATABASE",
          dbName
        });
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

export function deleteTable(conn, dbName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {

      RethinkDbService.deleteTable(conn, dbName, tableName).then((results) => {
        dispatch({
          type: "DELETE_TABLE",
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

export function saveRow(conn, selectedTable, row) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      ReQLEval(row).then(async(rowObj) => {
        row = convertStringsToDates(selectedTable.editingRecord, rowObj);
        selectedTable.codeBodyError = null;

        if (selectedTable.codeAction === 'update') {
          // Extra protection here if people alter the id when updating
          // Using replace will insert a new record
          // I'm assuming replace is less performant than update so lets use update when possible
          const matched = selectedTable.data.filter((item) => item.id === row.id).length === 1;

          if (matched) {
            const result = await RethinkDbService.update(conn, selectedTable.databaseName, selectedTable.name, row);
            handleResult(dispatch, result);
          } else {
            // The difference here is that it will create a new record if an id is not found
            const result = await RethinkDbService.replace(conn, selectedTable.databaseName, selectedTable.name, row);
            handleResult(dispatch, result);
          }
        } else if (selectedTable.codeAction === 'add') {
          const result = await RethinkDbService.insert(conn, selectedTable.databaseName, selectedTable.name, row);
          handleResult(dispatch, result);
        }
      }).catch((err) => {
        const codeBodyError = err.first_error || err + '' || 'There was an error. You can only save valid json to your table';
        dispatch({
          type: 'SET_CODE_BODY_ERROR',
          codeBodyError
        });

      });
    });
  }
}

function handleResult(dispatch, result) {
  dispatch({
    type: 'SET_LAST_DB_RESULT',
    lastResult: result
  });

  if (result.value.errors) {
    throw(result.value)
  } else {
    dispatch({
      type: "TOGGLE_EXPLORER_BODY",
      key: 'table'
    });
    dispatch(refreshExplorerBody());
  }
}

// Get table size
export function getTableSize(conn, dbName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      RethinkDbService.getTableSize(conn, dbName, tableName).then((size) => {
        dispatch({
          type: "SET_TABLE_SIZE",
          size
        });
        resolve();
      }).catch(function(err) {
        reject(err);
      });
    });
  }
}

export function refreshExplorerBody() {
  return (dispatch, getState) => {
    const conn = getState().main.dbConnection;
    const dbName = getState().main.selectedTable.databaseName;
    const tableName = getState().main.selectedTable.name;
    // Run last query to update view

    return dispatch(queryTable(conn, dbName, tableName, getState().main.selectedTable.query));
  }
}

export function deleteRow(row) {
  return (dispatch, getState) => {
    const conn = getState().main.dbConnection;
    const dbName = getState().main.selectedTable.databaseName;
    const tableName = getState().main.selectedTable.name;
    return RethinkDbService.delete(conn, dbName, tableName, row).then((result) => {
      if (result.value.errors) {
        throw(result.value)
      } else {
        // Toggle ConfirmRowDelete popup
        dispatch({
          type: "TOGGLE_CONFIRM_ROW_DELETE"
        });
        // Run last query to update view
        dispatch(refreshExplorerBody());
      }

    }).catch((err) => {
      const rowDeleteError = err.first_error || err + '' || 'There was an error. You can only save valid json to your table';
      dispatch({
        type: "SET_ROW_DELETE_ERROR",
        rowDeleteError
      });
    });
  }
}