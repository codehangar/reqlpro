import * as types from '../../../../../action-types';

// ------------------------------------
// Helpers
// ------------------------------------
function setDbTables(state, dbName, tables) {
  console.log('setDbTables', state, dbName, tables);
  return Object.assign({}, state, {
    [dbName]: tables
  });
}

function addTable(state, dbName, table) {
  const tables = state[dbName].concat(table);
  tables.sort((a, b) => a > b);
  return Object.assign({}, state, {
    [dbName]: tables
  });
}

function deleteTable(state, dbName, tableName) {
  const tables = state[dbName].filter(table => table !== tableName);
  return Object.assign({}, state, {
    [dbName]: tables
  });
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};
export function tables(state = initialState, action) {
  switch (action.type) {
    case types.SET_DB_TABLES:
      console.log('SET_DB_TABLES')
      return setDbTables(state, action.dbName, action.tables);
    case types.ADD_TO_TABLE_LIST:
      return addTable(state, action.dbName, action.tableName);
    case types.DELETE_TABLE:
      return deleteTable(state, action.dbName, action.tableName);
    default:
      return state;
  }
}
