window.rethinkDbClient = require('./scripts/rethinkdb.client');
var RethinkDbClient = window.rethinkDbClient;
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App/App');
var Connection = require('./models/Connection');

function init() {

	// Setup connection object for connectionForm
	RethinkDbClient.connection = Connection.create();
	// If anything in memeory for favorites load the first one when app starts
	if(rethinkDbClient.favorites.length) {
		RethinkDbClient.updateSelectedFavorite(rethinkDbClient.favorites[0]);
	}
	// Render App Component
	ReactDOM.render(
	  <App rethinkDbClient={RethinkDbClient} />,
	  document.getElementById('app')
	);
};

init();