import React from 'react';
import { connect } from 'react-redux';
import DatabasesHeader from './DatabasesHeader';
import Database from './Database/Database';

const Databases = ({
  databases
}) => {
  let databaseNodes;

  if (databases) {
    databaseNodes = databases.map((database) => {
      return (
        <Database
          key={database.name}
          database={database}
        />
      );
    });
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
  };
};

export default connect(mapStateToProps)(Databases);
