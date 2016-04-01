var React = require('react');
var classNames = require('classnames');
var DatabasesHeader = require('../DatabasesHeader/DatabasesHeader');
var Database = require('../Database/Database');

var Databases = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  render: function() {
    var _this = this;
    var databaseNodes = this.props.selectedFavorite.databases.map(function(database) {
      return (
        <Database key={database.name} database={database} />
      );
    });
    return (
      <div className="col-md-9 sidebar-content-col no-float">
        <DatabasesHeader selectedFavorite={this.props.selectedFavorite} />
        {databaseNodes}
      </div>
    );
  }
});

module.exports = Databases;