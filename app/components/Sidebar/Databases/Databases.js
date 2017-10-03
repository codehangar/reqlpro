import React from 'react';
import { connect } from 'react-redux';
import DatabasesHeader from './DatabasesHeader';
import Database from '../Database/Database';

const Databases = ({
  databases,
  connectionError,
  connections,
  dbConnection
}) => {
  let databaseNodes;

  if (databases && !(!!connectionError) && connections.length > 0) {
    databaseNodes = databases.map((database) => {
      return (
        <Database
          key={database.name}
          database={database}
        />
      );
    });
  } else {
    databaseNodes = ''; 
  }

  return (
    <div className="db-content-col">
      <DatabasesHeader />
      {databaseNodes}
    </div>
  );


};

const mapStateToProps = (state) => {
  return {
    databases: state.databases,
    dbConnection: state.main.dbConnection,
    connectionError: state.main.connectionError,
    connections: state.connections || [],
  };
};

export default connect(mapStateToProps)(Databases);
