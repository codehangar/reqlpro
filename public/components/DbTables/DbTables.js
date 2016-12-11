var React = require('react');
var DbTable = require('../DbTable/DbTable');

const DbTables = ({
  database,
  onAddTable
}) => {
    return(
      <div>{database.tables.map(table => <DbTable key={table} table={table} database={database} /> )}</div>
    );
}

module.exports = DbTables;
