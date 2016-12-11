var React = require('react');
var DbTable = require('../DbTable/DbTable');
var AddDbTable = require('../AddDbTable/AddDbTable');

const DbTables = ({
  database,
  onAddTable
}) => {
  return(
    <div className="db-tables noselect">
      {database.tables.map(table => <DbTable key={table} table={table} database={database} /> )}
      <AddDbTable onAddTable={()=>onAddTable(database)}/>
    </div>
  );
}

module.exports = DbTables;
