// const {ipcRenderer} = require('electron');
// import {modeled} from 'react-redux-form';
import {
  setState,
  setEmail,
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
  removeSelectedTable,
  updateSelectedTable,
  updateSelectedTablePageLimit,
  updateSelectedTableSort,
  setSelectedTableSize,
  setFilterPredicate,
  setOrderByPredicate,
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
  setConnectionError,
  setColumnWidths
} from './core';

export function main(state = {}, action) {
  // console.log("-----------------------")
  // console.log("REDUCER: action", action)
  // console.log("-----------------------")
  switch (action.type) {
    case 'SET_STATE':
      return action.state.main;
    case 'SET_EMAIL':
      return setEmail(state, action.email);
    case 'HIDE_OPEN_MENUS':
      return hideOpenMenus(state, action.props);
    case 'SET_DB_CONNECTION':
      return setDbConnection(state, action.dbConnection);
    case 'TOGGLE_DATABASE_FORM':
      return toggleDatabaseForm(state, action.showDatabaseForm);
    case 'TOGGLE_DELETE_DATABASE_FORM':
      return toggleDeleteDatabaseForm(state, action.showDeleteDatabaseForm, action.dbToDelete);
    case 'TOGGLE_DELETE_TABLE_FORM':
      return toggleDeleteTableForm(state, action.showDeleteTableForm, action.database, action.tableToDelete);
    case 'TOGGLE_TABLE_FORM':
      return toggleTableForm(state, action.showTableForm);
    case 'SET_DB_TO_EDIT':
      return setDbToEdit(state, action.database);
    case 'SET_SELECTED_TABLE':
      return setSelectedTable(state, action.databaseName, action.tableName);
    case 'REMOVE_SELECTED_TABLE':
      return removeSelectedTable(state);
    case 'UPDATE_SELECTED_TABLE':
      return updateSelectedTable(state, action.data, action.lastResult, action.queryError);
    case 'SET_TABLE_PAGE_LIMIT':
      return updateSelectedTablePageLimit(state, action.limit);
    case 'SET_TABLE_SORT':
      return updateSelectedTableSort(state, action.field);
    case 'SET_TABLE_SIZE':
      return setSelectedTableSize(state, action.size);
    case 'SET_FILTER_PREDICATE':
      return setFilterPredicate(state, action.filterPredicate);
    case 'SET_ORDER_BY_PREDICATE':
      return setOrderByPredicate(state, action.orderByPredicate);
    case 'SET_ROW_EDIT':
      return startRowEdit(state, action.row);
    case 'CANCEL_ROW_EDIT':
      return cancelRowEdit(state, action.row);
    case 'TOGGLE_EXPLORER_BODY':
      return toggleExplorerBody(state, action.key);
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
    case 'SET_TABLE_COLUMN_WIDTH':
      return setColumnWidths(state, action.databaseName, action.tableName, action.width);
  }
  return state;
}

// export default main;
