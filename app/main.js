// Module needed to access global values from main process to any renderer process
import { remote, ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Provider } from 'react-redux';

import Segment from './services/segment.service';
import ConfigService from './services/config.service';
import { getKeysForConnection } from './services/keychain.service';
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
      Segment.identify({
        userId: userConfig.email,
        traits: {
          email: userConfig.email,
          created: userConfig.created,
          connectionsCount: userConfig.connections.length,
          'Uses Permissions': usesPerms
        }
      });

      //track the app open event
      Segment.track({
        event: 'Open App'
      });

      //track any error events
      window.onerror = function(message, file, line, col, error) {
        Segment.track({
          event: 'Error',
          properties: {
            message,
            file,
            line,
            col,
            error
          }
        });
      };

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
              <App />
            </Provider>,
            document.getElementById('app')
          );
        });
    });
}

const getConnectionsWithPasswords = (connections) => {
  return Promise.all(connections.map(async (conn) => {
    const { pass, ca } = await getKeysForConnection(conn);
    return {...conn, pass, ca};
  }));
}

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
