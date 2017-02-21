import * as core from './core';
import * as types from './action-types';

export function main(state = {}, action) {
  // console.log("-----------------------")
  // console.log("REDUCER: action", action)
  // console.log("-----------------------")
  switch (action.type) {
    case 'SET_STATE':
      return action.state.main;
    case 'SET_EMAIL':
      return core.setEmail(state, action.email, action.created);
    case 'HIDE_OPEN_MENUS':
      return core.hideOpenMenus(state, action.props);
    case 'SET_DB_CONNECTION':
      return core.setDbConnection(state, action.dbConnection);
    case 'SET_DB_CONNECTION_ERROR':
      return core.setConnectionError(state, action.connectionError);
    // ------------------------------------
    // Databases
    // ------------------------------------
    case types.SET_DB_TO_EDIT:
      return core.setDbToEdit(state, action.database);
    case types.TOGGLE_DATABASE_FORM:
      return core.toggleDatabaseForm(state, action.showDatabaseForm);
    case types.TOGGLE_DELETE_DATABASE_FORM:
      return core.toggleDeleteDatabaseForm(state, action.showDeleteDatabaseForm, action.dbToDelete);
    case types.SET_DELETE_DATABASE_CONFIRM_ERROR:
      return core.setDeleteDatabaseConfirmError(state, action.deleteDatabaseConfirmError);
    case types.SET_DATABASE_FORM_ERROR:
      return core.setDatabaseFormError(state, action.databaseFormError);
    // ------------------------------------
    // Tables
    // ------------------------------------
    case types.TOGGLE_DELETE_TABLE_FORM:
      return core.toggleDeleteTableForm(state, action.showDeleteTableForm, action.database, action.tableToDelete);
    case types.TOGGLE_TABLE_FORM:
      return core.toggleTableForm(state, action.showTableForm);
    case types.SET_SELECTED_TABLE:
      return core.setSelectedTable(state, action.databaseName, action.tableName);
    case types.REMOVE_SELECTED_TABLE:
      return core.removeSelectedTable(state);
    case types.UPDATE_SELECTED_TABLE:
      return core.updateSelectedTable(state, action.data, action.lastResult, action.queryError);
    case types.SET_DELETE_TABLE_CONFIRM_ERROR:
      return core.setDeleteTableConfirmError(state, action.deleteTableConfirmError);
    case types.SET_TABLE_FORM_ERROR:
      return core.setTableFormError(state, action.tableFormError);
    // ------------------------------------
    // Query
    // ------------------------------------
    case 'SET_TABLE_QUERY':
      return core.setTableQuery(state, action.query);
    case 'SET_TABLE_PAGE_LIMIT':
      return core.updateSelectedTablePageLimit(state, action.limit);
    case 'SET_TABLE_SORT':
      return core.updateSelectedTableSort(state, action.field);
    case 'SET_TABLE_SIZE':
      return core.setSelectedTableSize(state, action.size);
    case 'SET_FILTER_PREDICATE':
      return core.setFilterPredicate(state, action.filterPredicate);
    case 'SET_ORDER_BY_PREDICATE':
      return core.setOrderByPredicate(state, action.orderByPredicate);
    case 'TOGGLE_EXPLORER_BODY':
      return core.toggleExplorerBody(state, action.key);
    // ------------------------------------
    // Record / Row Actions
    // ------------------------------------
    case 'SET_ROW_EDIT':
      return core.startRowEdit(state, action.row);
    case 'SET_ROW_INLINE_EDIT':
      return core.startRowInlineEdit(state, action.row);
    case 'CANCEL_ROW_EDIT':
      return core.cancelRowEdit(state, action.row);
    case 'SET_CODE_BODY_ERROR':
      return core.setCodeBodyError(state, action.codeBodyError);
    case 'SET_CODE_BODY':
      return core.setCodeBody(state, action.codeBody);
    case 'SET_LAST_DB_RESULT':
      return core.setLastDbResult(state, action.lastResult);
    case 'TOGGLE_CONFIRM_ROW_DELETE':
      return core.toggleConfirmRowDelete(state, action.rowToDelete);
    case 'SET_ROW_DELETE_ERROR':
      return core.setRowDeleteError(state, action.rowDeleteError);
    case 'SET_TABLE_COLUMN_WIDTH':
      return core.setColumnWidths(state, action.databaseName, action.tableName, action.width);

  }
  return state;
}

// export default main;
