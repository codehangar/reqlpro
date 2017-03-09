import React from 'react';
import DbTable from './DbTable';

const DbTables = ({
  database,
  tables = []
}) => {
  return (
    <div>{tables.map(table => <DbTable key={table} table={table} database={database}/>)}</div>
  );
};

export default DbTables;
