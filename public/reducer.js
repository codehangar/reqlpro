// const {ipcRenderer} = require('electron');
import { modeled } from 'react-redux-form';
import {
  setState,
  setConnections,
  setConnection,
  setEmail,
  addConnection,
  updateConnection,
  showConnectionForm,
  hideConnectionForm,
  setDbConnection,
  hideOpenMenus
} from './core';

function reducer(state = {}, action) {
  // console.log("-----------------------")
  // console.log("REDUCER: action", action)
  // console.log("-----------------------")
  switch (action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'SET_CONNECTIONS':
      return setConnections(state, action.connections);
    case 'SET_CONNECTION':
      return setConnection(state, action.connection);
    case 'SET_EMAIL':
      return setEmail(state, action.email);
    case 'ADD_CONNECTION':
      // ipcRenderer.send('writeConfigFile', state.userConfig);
      return hideConnectionForm(addConnection(state, action.connection));
    case 'UPDATE_CONNECTION':
      return hideConnectionForm(updateConnection(state, action.connection));
    case 'SHOW_CONNECTION_FORM':
      return showConnectionForm(state, action.mode, action.selectedConnection);
    case 'HIDE_CONNECTION_FORM':
      return hideConnectionForm(state);
    case 'HIDE_OPEN_MENUS':
      return hideOpenMenus(state, action.props)
    case 'SET_DB_CONNECTION':
      return setDbConnection(state, action.dbConnection);
  }
  return state;
}

const myModeledReducer = modeled(reducer, 'main');

export default myModeledReducer;
