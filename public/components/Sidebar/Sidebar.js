var React = require('react');
var Favorites = require('../Favorites/Favorites');
var Databases = require('../Databases/Databases');

var Sidebar = React.createClass({
  render: function() {
    return (
      <div className="sidebar">
        <Favorites />
        <Databases />
      </div>
    );
  }
});

module.exports = Sidebar;