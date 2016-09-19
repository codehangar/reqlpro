// const {ipcRenderer} = require('electron');
import {
  setState,
  setConnections,
  setConnection,
  setEmail,
  addConnection,
  updateConnection,
  showConnectionForm,
  hideConnectionForm,
  toggleConnectionActionMenu,
  hideOpenMenus
} from './core';

export default function reducer(state = {}, action) {
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
      return updateConnection(state, action.connection);
    case 'SHOW_CONNECTION_FORM':
      return showConnectionForm(state, action.mode, action.selectedConnection);
    case 'HIDE_CONNECTION_FORM':
      return hideConnectionForm(state);
    case 'TOGGLE_CONNECTION_ACTION_MENU':
      return toggleConnectionActionMenu(state, action.toggle);
    case 'HIDE_OPEN_MENUS':
      return hideOpenMenus(state, action.props)
  }
  return state;
}
