var React = require('react');
var classNames = require('classnames');
var DbTable = require('../DbTable/DbTable')

var DbTables = React.createClass({
  render: function() {
    var _this = this;
    var dbTableNodes = this.props.database.tables.map((table) => {
      return (
        <DbTable key={table.name} table={table} database={this.props.database} />
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
