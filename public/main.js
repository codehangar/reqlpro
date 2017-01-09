// Require our sass files
require("../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require("../node_modules/font-awesome/scss/font-awesome.scss");
require("./styles/index.scss");
// Index template
require.context('./', true, /index\.html$/);
// About template
require.context('./', true, /about\.html$/);
// IMAGES
require.context('./images', true, /^\.png\//);

// Module needed to access global values from main process to any renderer process
const remote = window.nodeRequire('remote');

// Segment
import Segment from './services/segment.service';

// React Specific libs/components
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import {Provider} from 'react-redux';
import reduxStore from './store';
import {getDbConnection} from './actions';

function init() {
  const initialState = JSON.parse(remote.getGlobal('userConfig'));

  if (initialState) {

    let state = {
      email: initialState.email || null,
      connections: initialState.connections || []
    };

    //if connections, set selectedConnection and getDbConnection
    if (initialState.connections && initialState.connections[0]) {
      state.selectedConnection = initialState.connections[0];
      reduxStore.dispatch(getDbConnection(state.selectedConnection));
    }

    reduxStore.dispatch({
      type: 'SET_STATE',
      state
    });

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
