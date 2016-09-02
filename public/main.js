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
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import {List, Map, fromJS} from 'immutable';

const reduxStore = createStore(reducer);

// reduxStore.dispatch({
//   type: 'SET_EMAIL',
//   // state: {},
//   email: 'cassie@codehangar.io'
// });
// Create Provider Class to provide global store to anyone who wants it
// class Provider extends React.Component {
//   getChildContext() {
//     return {
//       store: this.props.store
//     };
//   }

//   render() {
//     return this.props.children;
//   }
// }
// Provider.childContextTypes = {
//   store: React.PropTypes.object
// }

function init() {
  // If anything in memory for favorites load the first one when app starts
  // if (store.userConfig.favorites.length) {
  //   store.updateSelectedFavorite(store.userConfig.favorites[0]);
  // }
  // const initialState = JSON.parse(remote.getGlobal('userConfig'))
  const initialState = JSON.parse(remote.getGlobal('userConfig'))

  console.log('initialState', initialState)

  if(initialState){
     reduxStore.dispatch({type: 'SET_STATE', state: initialState})
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
