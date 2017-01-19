import * as types from '../../../action-types';

function showConnectionForm(state) {
  return Object.assign({}, state, {
    showForm: true
  });
}

function hideConnectionForm(state) {
  return Object.assign({}, state, {
    showForm: false
  });
}

function setConnection(state, connection) {
  return Object.assign({}, state, {
    selected: connection
  });
}


const initialState = {};

export function connection(state = initialState, action) {
  switch (action.type) {
    case 'SET_STATE':
      return action.state.connection;
    case types.SET_CONNECTION:
      return setConnection(state, action.connection);
    case types.SHOW_CONNECTION_FORM:
      return showConnectionForm(state, action.connection);
    case types.HIDE_CONNECTION_FORM:
    case types.ADD_CONNECTION:
    case types.UPDATE_CONNECTION:
    case types.DELETE_CONNECTION:
      return hideConnectionForm(state);
    default:
      return state;
  }
}

