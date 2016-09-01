import {
  setConnections
} from './core';

export default function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONNECTIONS':
      return setConnections(state, action.connections);
  }
  return state;
}
