var React = require('react');
var classNames = require('classnames');
var DbTable = require('../DbTable/DbTable')

var DbTables = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  render: function() {
    var _this = this;
    var dbTableNodes = this.props.database.tables.map(function(table) {
      return (
        <DbTable key={table.name} table={table} database={_this.state.database} />
      );
    });
    return (
      <div className="db-tables">
        {dbTableNodes}
      </div>
    );
  }
});

module.exports = DbTables;