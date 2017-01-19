import * as types from '../../../action-types';

function setDbList(databases) {
  return databases;
}

function toggleTableVisibility(state, database, showTables) {
  const databasesCopy = state.slice(0);
  let selectedDatabase = databasesCopy.filter(db => db.name === database.name)[0];
  const index = databasesCopy.map(db => db.name).indexOf(database.name);

  // Assign the new showTables Value
  selectedDatabase = Object.assign({}, selectedDatabase, { showTables });

  // Replace the selected database
  const databases = [...databasesCopy.slice(0, index), ...[selectedDatabase], ...databasesCopy.slice(index + 1)];
  const selectedConnection = Object.assign({}, state.selectedConnection, { databases });

  const newState = Object.assign({}, state, { selectedConnection });

  return databases;
}

function addDatabase(state, database) {
  return state.concat(database);
}

function deleteDatabase(state, dbName) {
  return state.filter(db => db.name != dbName);
}

const initialState = [];

export function databases(state = initialState, action) {
  switch (action.type) {
    case types.SET_DB_LIST:
      return setDbList(action.databases);
    case types.TOGGLE_TABLE_VISIBILITY:
      return toggleTableVisibility(state, action.database, action.showTables);
    case types.ADD_TO_DB_LIST:
      return addDatabase(state, action.database);
    case types.DELETE_DATABASE:
      return deleteDatabase(state, action.dbName);
    default:
      return state;
  }
}

