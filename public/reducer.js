// const {ipcRenderer} = require('electron');
import {modeled} from 'react-redux-form';
import {
  setState,
  setConnections,
  setConnection,
  setEmail,
  addConnection,
  updateConnection,
  deleteConnection,
  showConnectionForm,
  hideConnectionForm,
  setDbConnection,
  setDbList,
  hideOpenMenus,
  setDbTables,
  toggleDatabaseForm,
  toggleDeleteDatabaseForm,
  toggleTableForm,
  toggleDeleteTableForm,
  addDatabase,
  setDbToEdit,
  addTable,
  toggleTableVisibility,
  setSelectedTable,
  updateSelectedTable,
  updateSelectedTablePageLimit,
  updateSelectedTableSort,
  setSelectedTableSize,
  startRowEdit,
  cancelRowEdit,
  toggleExplorerBody,
  deleteDatabase,
  deleteTable,
  setCodeBodyError,
  setCodeBody,
  setLastDbResult,
  toggleConfirmRowDelete,
  setRowDeleteError,
  setConnectionError
} from './core';

function reducer(state = {}, action) {
  // console.log("-----------------------")
  // console.log("REDUCER: action", action)
  // console.log("-----------------------")
  switch (action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'SET_CONNECTIONS':
      return setConnections(state, action.connections);
    case 'SET_CONNECTION':
      return setConnection(state, action.connection);
    case 'SET_EMAIL':
      return setEmail(state, action.email);
    case 'ADD_CONNECTION':
      // ipcRenderer.send('writeConfigFile', state.userConfig);
      return hideConnectionForm(addConnection(state, action.connection));
    case 'UPDATE_CONNECTION':
      return hideConnectionForm(updateConnection(state, action.connection));
    case 'DELETE_CONNECTION':
      return hideConnectionForm(deleteConnection(state, action.id));
    case 'SHOW_CONNECTION_FORM':
      return showConnectionForm(state, action.mode, action.selectedConnection);
    case 'HIDE_CONNECTION_FORM':
      return hideConnectionForm(state);
    case 'HIDE_OPEN_MENUS':
      return hideOpenMenus(state, action.props);
    case 'SET_DB_CONNECTION':
      return setDbConnection(state, action.dbConnection);
    case 'SET_DB_LIST':
      return setDbList(state, action.databases);
    case 'SET_DB_TABLES':
      console.log('action.database', action.database);
      return setDbTables(state, action.database.name, action.tables);
    case 'TOGGLE_DATABASE_FORM':
      return toggleDatabaseForm(state, action.showDatabaseForm);
    case 'TOGGLE_DELETE_DATABASE_FORM':
      return toggleDeleteDatabaseForm(state, action.showDeleteDatabaseForm, action.dbToDelete);
    case 'TOGGLE_DELETE_TABLE_FORM':
      console.log('TOGGLE_DELETE_TABLE_FORM', action.tableToDelete)
      return toggleDeleteTableForm(state, action.showDeleteTableForm, action.database, action.tableToDelete);
    case 'ADD_TO_DB_LIST':
      return toggleDatabaseForm(addDatabase(state, action.database), false);
    case 'ADD_TO_TABLE_LIST':
      return addTable(state, action.database, action.table);
    case 'TOGGLE_TABLE_VISIBILITY':
      return toggleTableVisibility(state, action.database, action.showTables);
    case 'TOGGLE_TABLE_FORM':
      return toggleTableForm(state, action.showTableForm);
    case 'SET_DB_TO_EDIT':
      return setDbToEdit(state, action.database);
    case 'SET_SELECTED_TABLE':
      return setSelectedTable(state, action.databaseName, action.tableName);
    case 'UPDATE_SELECTED_TABLE':
      return updateSelectedTable(state, action.data, action.lastResult);
    case 'SET_TABLE_PAGE_LIMIT':
      return updateSelectedTablePageLimit(state, action.limit);
    case 'SET_TABLE_SORT':
      return updateSelectedTableSort(state, action.field);
    case 'SET_TABLE_SIZE':
      return setSelectedTableSize(state, action.size);
    case 'SET_ROW_EDIT':
      return startRowEdit(state, action.row);
    case 'CANCEL_ROW_EDIT':
      return cancelRowEdit(state, action.row);
    case 'TOGGLE_EXPLORER_BODY':
      return toggleExplorerBody(state, action.key);
    case 'DELETE_DATABASE':
      return deleteDatabase(state, action.dbName);
    case 'DELETE_TABLE':
      return deleteTable(state, action.dbName, action.tableName);
    case 'SET_CODE_BODY_ERROR':
      return setCodeBodyError(state, action.codeBodyError);
    case 'SET_CODE_BODY':
      return setCodeBody(state, action.codeBody);
    case 'SET_LAST_DB_RESULT':
      return setLastDbResult(state, action.lastResult);
    case 'TOGGLE_CONFIRM_ROW_DELETE':
      return toggleConfirmRowDelete(state, action.rowToDelete);
    case 'SET_ROW_DELETE_ERROR':
      return setRowDeleteError(state, action.rowDeleteError);
    case 'SET_DB_CONNECTION_ERROR':
      return setConnectionError(state, action.connectionError);
  }
  return state;
}

const myModeledReducer = modeled(reducer, 'main');

export default myModeledReducer;
