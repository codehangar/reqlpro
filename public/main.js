// Require our sass files
require("../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require("../node_modules/font-awesome/scss/font-awesome.scss");
require("./styles/index.scss");
// Index template
require.context('./', true, /index\.html$/);
// About template
require.context('./', true, /about\.html$/);
// IMAGES
require.context('./images', true, /^\.\//);
// Module needed to access global values from main process to any renderer process
var remote = window.nodeRequire('remote');
// var remote = require('remote');
// Define the store class
// var Store = require('./scripts/global.store');
// Connection model for connection favorites
// var Connection = require('./models/Connection');
// Instantiate store Class with any params needed
// const store = new Store({
//   userConfig: JSON.parse(remote.getGlobal('userConfig')), // Setup userConfig from config file
//   connection: Connection.create() // Setup default connection for ConnectionForm
// });

// React Specific libs/components
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App/App');
// Segment

var Segment = require('./services/segment.service');

import {Provider} from 'react-redux';
import reduxStore from './store';
import {getDbConnection} from './actions';

function init() {
  // If anything in memory for favorites load the first one when app starts
  // if (store.userConfig.favorites.length) {
  //   store.updateSelectedFavorite(store.userConfig.favorites[0]);
  // }
  // const initialState = JSON.parse(remote.getGlobal('userConfig'))
  const initialState = JSON.parse(remote.getGlobal('userConfig'));

  // console.log('initialState', initialState)

  if (initialState) {

    // Looks for favorites field from versions 0.0.3 and prior
    if (initialState.favorites) {
      initialState.connections = initialState.favorites;
    }

    let state = {
      email: initialState.email || null,
        connections: initialState.connections || []
    };

    //if connections, set selectedConnection and getDbConnection
    if(initialState.connections){
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
};

init();
