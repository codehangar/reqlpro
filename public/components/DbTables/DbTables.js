var React = require('react');
var DbTable = require('../DbTable/DbTable')

var DbTables = React.createClass({
  render: function() {

    const dbTableNodes = this.props.database.tables.map((table) => {
      return (
        <DbTable key={table.name} table={table} database={this.props.database} />
      );
    });

    return (
      <div className="db-tables noselect">
        {dbTableNodes}
      </div>
    );
  }
});

module.exports = DbTables;
