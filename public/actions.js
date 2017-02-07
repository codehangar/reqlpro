import co from 'co';
import RethinkDbService from './services/rethinkdb.service';
import ReQLEval from './services/reql-eval.service';
import { convertStringsToDates } from './services/date-type.service'
import configService from './services/config.service';

// export function queryTable(queryParams = selectedTable.query) {
// Todo: pull from passed in queryParams or default to selectedTable on state (or leave as is, not sure)
export function queryTable(conn, db, table, query = {
  filterPredicate: '',
  orderByPredicate: "r.asc('id')",
  limit: 5,
  page: 1
}) {
  if (query.page) {
    return getTableData(conn, db, table, query);
  } else if (query.index) {
    return getTableDataBetween(query.index, query.start, query.end, conn, db, table);
  }
}

function getTableData(conn, db, table, query) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'SET_CONNECTION_LOADING',
        loading: true
      });
      dispatch({
        type: 'SET_TABLE_QUERY',
        query
      });
      co(function *() {
        let { filterPredicate, orderByPredicate, limit, page } = query;

        if (filterPredicate) {
          filterPredicate = yield ReQLEval(filterPredicate);
        }

        const orderBy = yield orderByPredicate.split(',').map((p) => {
          if (p) {
            return ReQLEval(p);
          } else {
            return '';
          }
        });

        if (page < 1) {
          page = 1;
        }

        const result = yield RethinkDbService.getTableData(conn, db, table, filterPredicate, orderBy, limit, page);

        dispatch({
          type: 'UPDATE_SELECTED_TABLE',
          lastResult: result,
          data: result.value
        });
        dispatch(getTableSize(conn, db, table));
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        resolve(result);
      })
        .catch(error => {
          if (!error.msg) {
            error.msg = error.message;
          }
          dispatch({
            type: 'UPDATE_SELECTED_TABLE',
            queryError: error
          });
          dispatch({
            type: 'SET_CONNECTION_LOADING',
            loading: false
          });
          reject(error);
        });
    });
  }
}

function getTableDataBetween(index, start, end, dbConnection, databaseName, tableName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'SET_CONNECTION_LOADING',
        loading: true
      });
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
          data: result.value
        });
        dispatch(getTableSize(conn, db, table));
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        resolve(result);

      }).catch(function(error) {
        dispatch({
          type: 'UPDATE_SELECTED_TABLE',
          queryError: error
        });
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
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
            /*
             * TODO: Figure out if this is relevant - but it was removed to solve HelpScout #49
             * i.e. document fields can not be removed via the update operation
             * const result = await RethinkDbService.update(conn, selectedTable.databaseName, selectedTable.name, row);
             */
            const result = await RethinkDbService.replace(conn, selectedTable.databaseName, selectedTable.name, row);
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

export function writeConfigFile() {
  return (dispatch, getState) => {
    const state = getState();
    return configService.writeConfigFile({
      email: state.main.email,
      created: state.main.created,
      connections: state.connections
    });
  }
}
