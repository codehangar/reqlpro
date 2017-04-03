// Require our sass files
require("../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require("../node_modules/font-awesome/scss/font-awesome.scss");
require("./styles/index.scss");

// // Module needed to access global values from main process to any renderer process
import { remote, ipcRenderer } from 'electron';
// Segment
import Segment from './services/segment.service';
import ConfigService from './services/config.service';
// React Specific libs/components
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Provider } from 'react-redux';
import store from './store';
import { getDbConnection } from './components/Sidebar/Connections/selectedConnection.actions';

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

      const initialState = createInitialState(userConfig);

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
}

export function createInitialState(config) {
  let state = {
    main: { email: config.email || null },
    connections: config.connections || [],
    connection: {}
  };
  if (config.connections && config.connections[0]) {
    state.connection.selected = config.connections[0];
  }
  return state;
};

initApp();
