// Require our sass files
require("../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require("../node_modules/font-awesome/scss/font-awesome.scss");
require("./styles/index.scss");
// Index template
// require.context('./', true, /index\.html$/);
// About template
// require.context('./', true, /about\.html$/);
// IMAGES
require.context('./images', true, /^\.png\//);

// Module needed to access global values from main process to any renderer process
import { remote } from 'electron';

// Segment
import Segment from './services/segment.service';

// React Specific libs/components
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Provider } from 'react-redux';
import reduxStore from './store';
import { getDbConnection } from './components/Sidebar/Connections/selectedConnection.actions';

function init() {
  const userConfig = JSON.parse(remote.getGlobal('userConfig'));
  console.log('userConfig', userConfig); // eslint-disable-line no-console

  if (userConfig) {

    let state = {
      main: { email: userConfig.email || null },
      connections: userConfig.connections || [],
      connection: {}
    };

    //if connections, set selectedConnection and getDbConnection
    if (userConfig.connections && userConfig.connections[0]) {
      state.connection.selected = userConfig.connections[0];
    }

    // Set Initial State
    reduxStore.dispatch({
      type: 'SET_STATE',
      state
    });

    // If a connection exists, connect to it
    if (state.connection.selected) {
      reduxStore.dispatch(getDbConnection(state.connection.selected));
    }
  }

  Segment.track({
    event: 'app.open',
    properties: {}
  });

  // Render App Component
  ReactDOM.render(
    <Provider store={reduxStore}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
}

init();
