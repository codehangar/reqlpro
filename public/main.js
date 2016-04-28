// Require our sass files
require("../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss");
require("../node_modules/font-awesome/scss/font-awesome.scss");
require("./styles/main.scss");

// TEMPLATES
require.context('./', true, /index\.html$/);

// IMAGES
require.context('./images', true, /^\.\//);

// Module needed to access global values from main process to any renderer process
var remote = window.nodeRequire('remote');
// var remote = require('remote');

// Define the RethinkDbClient class
var RethinkDbClient = require('./scripts/rethinkdb.client');

// Connection model for connection favorites
var Connection = require('./models/Connection');

// Instantiate RethinkDbClient Class with any params needed
RethinkDbClient = new RethinkDbClient({
  favorites: JSON.parse(remote.getGlobal('userConfig')).favorites, // Setup favorites from config file
  connection: Connection.create() // Setup default connection for connectionForm
});

// Attach this new instance to window object for global access
window.rethinkDbClient = RethinkDbClient;

// React Specific libs/components
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App/App');

function init() {
  // If anything in memeory for favorites load the first one when app starts
  if (window.rethinkDbClient.favorites.length) {
    window.rethinkDbClient.updateSelectedFavorite(window.rethinkDbClient.favorites[0]);
  }
  // Render App Component
  ReactDOM.render(
    <App rethinkDbClient={window.rethinkDbClient} />,
    document.getElementById('app')
  );
};

init();
