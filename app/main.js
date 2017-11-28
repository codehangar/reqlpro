// Module needed to access global values from main process to any renderer process
import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Provider } from 'react-redux';
import ConfigService from './services/config.service';
import store from './store';
import { getDbConnection } from './data/selectedConnection.actions';

// Require our sass files
require("../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require("../node_modules/font-awesome/scss/font-awesome.scss");
require("./styles/index.scss");

export function initApp() {

  // Set Up  Renderer (Browser-side) Events Listeners
  ipcRenderer.on('launchFeedbackPopup', (event, message) => {
    HS.beacon.open();
  });

  //Read Config File and Apply Settings
  ConfigService.readConfigFile()
    .then((userConfig) => {

      // Identify User with correct settings
      const usesPerms = userConfig.connections.reduce((a, b) => !!a.user || !!b.user, false);

      // const initialState = createInitialState(userConfig);
      createInitialState(userConfig)
        .then((initialState) => {

          // Set Initial State
          store.dispatch({
            type: 'SET_STATE',
            state: initialState
          });

          // If a connection exists, connect to it
          if (initialState.connection.selected) {
            store.dispatch(getDbConnection(initialState.connection.selected));
          }

          // Render App Component
          ReactDOM.render(
            <Provider store={store}>
              <App/>
            </Provider>,
            document.getElementById('app')
          );
        });
    });
}

const getConnectionsWithPasswords = (connections) => {
  return Promise.all(connections.map((conn) => {
    const responseEventName = `get-password-keys-reply_${conn.index}`;
    const payload = {
      conn,
      responseEventName
    };
    ipcRenderer.send('get-password-keys', payload);
    return new Promise((resolve, reject) => {
      ipcRenderer.once(responseEventName, (event, keys) => {
        resolve({ ...conn, pass: keys.pass, ca: keys.ca });
      });
    });
  }));
};

export function createInitialState(config) {
  return new Promise(async (resolve, reject) => {
    let connections = [];
    if (config.connections && config.connections.length > 0) {
      connections = await getConnectionsWithPasswords(config.connections);
    }

    let state = {
      main: { email: config.email || null },
      connections: connections,
      connection: {}
    };
    if (connections && connections[0]) {
      state.connection.selected = connections[0];
    }
    resolve(state);
  });
}

initApp();
