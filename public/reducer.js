import {Map} from 'immutable';
import {
  setState,
  setConnections,
  setEmail,
  addConnection
} from './core';

export default function reducer(state = Map(), action) {
  // console.log('from reducer', state, action)
  switch (action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'SET_CONNECTIONS':
      return setConnections(state, action.connections);
    case 'SET_EMAIL':
      return setEmail(state, action.email);
    case 'ADD_CONNECTION':
      console.log('ADD_CONNECTION', state, action.connection);
      return addConnection(state, action.connection);
  }
  return state;
}
