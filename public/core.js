import {List, Map, fromJS} from 'immutable';

export function setState(state, newState) {
  return Object.assign({}, ...state, newState);;
}

export function setConnections(state, connections) {
  return state.set('connections', List(connections));
}

export function setEmail(state, email) {
  if (email) {
    return Object.assign(state, {email});
  }
  return state;
}

export function addConnection(state, connection) {
  let connections = [];
  if(state.connections) connections.push(state.connections);
  connections.push(connection);
  return Object.assign(state, {connections});
}