import {
  setConnections,
  setEmail
} from './core';

export default function reducer(state = new Map(), action) {
  console.log('from reducer', state, action)
  switch (action.type) {
    case 'SET_CONNECTIONS':
      return setConnections(state, action.connections);
    case 'SET_EMAIL':
      return setEmail(state, action.email);
  }
  return state;
}
