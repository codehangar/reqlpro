// import RethinkDbService from '../main/services/rethinkdb.service';
const RethinkDbService = require('../main/services/rethinkdb.service');

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
        dispatch({
          type: 'SET_DB_CONNECTION',
          dbConnection: error
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
        dispatch({
          type: 'SET_DB_LIST',
          databases: error
        });
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
        dispatch({
          type: 'SET_DB_TABLES',
          tables: error
        });
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
        dispatch({
          type: 'ADD_TO_DB_LIST',
          database: error,
        });
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
        dispatch({
          type: 'ADD_TO_TABLE_LIST',
          table: error,
        });
        reject(error);
      });
    });
  }
}

// export function queryTable(queryParams = this.selectedTable.query) {
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
  console.log('getTableData limit', limit)
  return dispatch => {
    return new Promise((resolve, reject) => {
      const conn = dbConnection;
      const db = databaseName;
      const table = tableName;

      if (page < 1) {
        page = 1;
      }

      RethinkDbService.getTableData(conn, db, table, sort, direction, limit, page).then((result) => {
        console.log("result.value", result.value)

        dispatch({
          type: 'UPDATE_SELECTED_TABLE',
          lastResult: result,
          // data: Object.keys(result.value).map(key => result.value[key]),//convert to array
          data: result.value,
          loading: false
        });

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
        dispatch({
          type: 'UPDATE_SELECTED_TABLE',
          lastResult: error,
          data: error,
          loading: false
        });
        reject(error);
      });
    });
  }
}

function getTableDataBetween(index, start, end, dbConnection, databaseName, tableName) {
  console.log('-----> getTableDataBetween', start, end)
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
        resolve(result);

      }).catch(function(error) {
        dispatch({
          type: 'UPDATE_SELECTED_TABLE',
          lastResult: error,
          data: error,
          loading: false
        });
        reject(error);
      });
    });
  }
}

export function deleteDatabase(conn, dbName) {
  console.log('deleting database', conn, dbName);
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
