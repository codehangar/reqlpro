import {List, Map, fromJS} from 'immutable';

export function setState(state, newState) {
  return Object.assign({}, ...state, newState);;
}

export function setConnections(state, connections) {
  return state.set('connections', List(connections));
}

export function setEmail(state, email) {
  if (email) {
    return Object.assign({}, state, {email});
  }
  return state;
}

export function addConnection(state, connection) {
  let connections = [];
  if(state.connections) connections = state.connections;
  if(connection) connections.push(connection);
  return Object.assign({}, state, {connections});
}

export function showConnectionForm(state, mode) {
  switch(mode){
    case 'NEW':
      let newState = Object.assign({}, state, {showAddConnectionForm:true})
      if(state.showEditConnectionForm) delete newState.showEditConnectionForm;
      return newState;
  }

  return state;
}

export function hideConnectionForm(state) {
      let newState = Object.assign({}, state)
      if(state.showEditConnectionForm) delete newState.showEditConnectionForm;
      if(state.showAddConnectionForm) delete newState.showAddConnectionForm;
      console.log('hideConnectionForm', newState)
      return newState;
}