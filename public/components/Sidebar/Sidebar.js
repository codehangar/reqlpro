var RethinkDbClient = window.rethinkDbClient;
var React = require('react');
var classNames = require('classnames');
var Favorites = require('../Favorites/Favorites');
var Databases = require('../Databases/Databases');

var Sidebar = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    return (
      <div className="left-content-col">
        <div id="sidebar" className="container sidebar-content">
          <div className="row sidebar-content-row">
            <Favorites favorites={this.state.rethinkDbClient.favorites} />
            <Databases selectedFavorite={this.state.rethinkDbClient.selectedFavorite} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;