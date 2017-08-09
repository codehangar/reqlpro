import { combineReducers } from 'redux';
import * as types from '../action-types';

export function setOrderByPredicate(state, orderByPredicate) {
  /**
   * The orderByPredicate is simply passed through
   * The below code is meant to extract sort and direction
   * from the different types of orderBy queries allowed by RethinkDB
   */
  const preds = orderByPredicate.split(',');
  const pieces = preds[0].match(/[^'"]+(?=['"])/g);
  const sort = pieces ? pieces[pieces.length - 1] : '';
  const direction = orderByPredicate.indexOf('desc') !== -1 ? 'desc' : 'asc';
  return { ...state, orderByPredicate, sort, direction };
}


const defaultQuery = {
  limit: 5,
  page: 1,
  sort: 'id',
  direction: 'asc',
  filterPredicate: '',
  orderByPredicate: ''
};

export function query(state = defaultQuery, action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return { ...defaultQuery };
    case types.SET_TABLE_QUERY:
      return action.query;
    case types.SET_TABLE_PAGE_LIMIT:
      const limit = parseInt(action.limit, 10);
      return { ...state, limit };
    case types.SET_TABLE_SORT:
      let direction = 'desc';
      if (state.sort === action.field) {
        direction = state.direction === 'asc' ? 'desc' : 'asc';
      }
      const orderByPredicate = `r.${direction}('${action.field}')`;
      return { ...state, sort: action.field, direction, orderByPredicate };
    case types.SET_ORDER_BY_PREDICATE:
      return setOrderByPredicate(state, action.orderByPredicate);
    case types.SET_FILTER_PREDICATE:
      return { ...state, filterPredicate: action.filterPredicate };
  }
  return state;
}

const defaultType = { current: 'table', prev: null };

export function view(state = defaultType, action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return { ...defaultType };
    case types.TOGGLE_EXPLORER_BODY:
      return { current: action.key, prev: state.current };
    case types.SET_ROW_EDIT:
      return { current: 'code', prev: state.current };
    case types.CANCEL_ROW_EDIT:
      return { current: state.prev, prev: null };
  }
  return state;
}

function data(state = [], action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return [];
    case types.UPDATE_SELECTED_TABLE:
      return action.data || [];
  }
  return state;
}

function lastResult(state = {}, action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return {};
    case types.SET_LAST_DB_RESULT:
    case types.UPDATE_SELECTED_TABLE:
      return action.lastResult || {};
  }
  return state;
}

function queryError(state = null, action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return null;
    case types.UPDATE_SELECTED_TABLE:
      return action.queryError || null;
  }
  return state;
}

function loading(state = false, action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return true;
    case types.UPDATE_SELECTED_TABLE:
      return false;
  }
  return state;
}

function databaseName(state = '', action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return action.databaseName;
  }
  return state;
}

function name(state = '', action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return action.tableName;
  }
  return state;
}

export function editingRecord(state = null, action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return null;
    case types.SET_ROW_EDIT:
    case types.SET_ROW_INLINE_EDIT:
      return action.row;
    case types.CANCEL_ROW_EDIT:
      return null;
  }
  return state;
}

function size(state = null, action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
      return null;
    case types.SET_TABLE_SIZE:
      return action.size;
  }
  return state;
}

const defaultCode = {
  action: 'add',
  body: "{\n  \n}",
  error: null,
};

export function code(state = defaultCode, action) {
  switch (action.type) {
    case types.SET_SELECTED_TABLE:
    case types.CANCEL_ROW_EDIT:
    case types.TOGGLE_EXPLORER_BODY:
      return { ...defaultCode };
    case types.SET_ROW_EDIT:
      return {
        action: 'update',
        body: JSON.stringify(action.row, null, '  '),
        error: null
      };
    case types.SET_ROW_INLINE_EDIT:
      return { ...state, action: 'update', error: null };
    case types.SET_CODE_BODY:
      return { ...state, body: action.codeBody };
    case types.SET_CODE_BODY_ERROR:
      return { ...state, error: action.codeBodyError };
  }
  return state;
}

const selectedTableReducer = combineReducers({
  databaseName,
  name,
  query,
  view,
  data,
  size,
  code,
  editingRecord,
  loading,
  lastResult,
  queryError
});

export default function(state, action) {
  if (action.type === types.SET_CONNECTION) {
    state = undefined;
  }

  return selectedTableReducer(state, action)
}
