var React = require('react');
var Favorites = require('../Favorites/Favorites');
var Databases = require('../Databases/Databases');

var Sidebar = React.createClass({
  render: function() {
    return (
      <div className="left-content-col">
        <div id="sidebar" className="container sidebar-content">
          <div className="row sidebar-content-row">
            <Favorites />
            <Databases />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;