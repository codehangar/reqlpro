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
}