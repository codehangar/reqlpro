// Require our sass files
require("../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require("../node_modules/font-awesome/scss/font-awesome.scss");
require("./styles/main.scss");


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
var Store = require('./scripts/global.store');

// Connection model for connection favorites
var Connection = require('./models/Connection');

// Instantiate store Class with any params needed
const store = new Store({
  favorites: JSON.parse(remote.getGlobal('userConfig')).favorites, // Setup favorites from config file
  connection: Connection.create() // Setup default connection for ConnectionForm
});

// React Specific libs/components
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App/App');

// Segment
var Segment = require('./services/segment.service');

// Create Provider Class to provide global store to anyone who wants it
class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }

  render() {
    return this.props.children;
  }
}
Provider.childContextTypes = {
  store: React.PropTypes.object
}

function init() {
  // If anything in memeory for favorites load the first one when app starts
  if (store.favorites.length) {
    store.updateSelectedFavorite(store.favorites[0]);
  }

  Segment.identify();
  Segment.track({
    event: 'app.open',
    properties: {}
  })


  // Render App Component
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
};

init();
