import * as types from '../../../action-types';
import jdenticon from 'jdenticon';
import md5 from 'md5';

function setConnections(state, connections) {
  return Object.assign({}, state, {
    main: {
      connections
    }
  });
}

function addConnection(state, connection) {
  const newConnection = Object.assign({}, connection, {
    identicon: jdenticon.toSvg(md5(connection.name), 40),
    index: state.length || 0
  });

  return state.concat(newConnection);
}

function updateConnection(state, connection) {
  return [...state.slice(0, connection.index), ...[connection], ...state.slice(connection.index + 1)];
}

function deleteConnection(state, connection) {
  return [...state.slice(0, connection.index), ...state.slice(connection.index + 1)];
}

export function setConnection(state, selectedConnection) {
  return Object.assign({}, state, {
    selectedConnection
  });
};


const initialState = [];

export function connections(state = initialState, action) {
  switch (action.type) {
    case 'SET_STATE':
      return action.state.connections;
    case types.SET_CONNECTIONS:
      return setConnections(state, action.connections);
    case types.ADD_CONNECTION:
      return addConnection(state, action.connection);
    case types.UPDATE_CONNECTION:
      return updateConnection(state, action.connection);
    case types.DELETE_CONNECTION:
      return deleteConnection(state, action.connection);
    default:
      return state;
  }
}

