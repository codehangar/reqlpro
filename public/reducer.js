import {Map} from 'immutable';
import {
  setState,
  setConnections,
  setEmail
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
  }
  return state;
}
