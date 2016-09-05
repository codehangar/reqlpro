// const {ipcRenderer} = require('electron');
import {Map} from 'immutable';
import {
  setState,
  setConnections,
  setEmail,
  addConnection,
  showConnectionForm,
  hideConnectionForm
} from './core';

export default function reducer(state = Map(), action) {
  switch (action.type) {
    case 'SET_STATE':
    console.log('action.state', action.state)
      return setState(state, action.state);
    case 'SET_CONNECTIONS':
      return setConnections(state, action.connections);
    case 'SET_EMAIL':
      return setEmail(state, action.email);
    case 'ADD_CONNECTION':
      // ipcRenderer.send('writeConfigFile', this.userConfig);
      return addConnection(state, action.connection);
    case 'SHOW_CONNECTION_FORM':
      return showConnectionForm(state, action.mode);
    case 'HIDE_CONNECTION_FORM':
      return hideConnectionForm(state);
  }
  return state;
}
