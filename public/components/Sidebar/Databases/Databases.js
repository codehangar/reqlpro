import React from 'react';
import {connect} from 'react-redux';
import DatabasesHeader from './DatabasesHeader';
import Database from './Database/Database';
import {getDbTables} from '../../../actions';

const Databases = ({
  connections, 
  selectedConnection,
  selectedDatabase,
  dbConnection,
  onDatabaseClick
}) => {
  let databaseNodes;

  if(selectedConnection && selectedConnection.databases){
    databaseNodes = selectedConnection.databases.map((database) => {
      return (
        <Database
          key={database.name}
          database={database}
          selectedDatabase={selectedDatabase}
          onDatabaseClick={() => onDatabaseClick(dbConnection, database)}
        />
      );
    });
  }


  const content = () => {
    if (connections && connections.length > 0) {
      return (
        <div>
          <DatabasesHeader selectedFavorite={selectedConnection} />
        </div>
      );
    } else {
      return (<div></div>);
    }
  }

  return (
    <div className="db-content-col">
      {content()}
      {databaseNodes}
    </div>
  );


};

function mapStateToProps(state) {
  console.log('Databases', state.main.selectedConnection)
  return {
    connections: state.main.connections,
    selectedConnection: state.main.selectedConnection,
    selectedDatabase: state.main.selectedDatabase,
    dbConnection: state.main.dbConnection,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    onEmailSubmit: (email) =>{
      dispatch({
        type: "SET_EMAIL",
        email
      });
    },
    onDatabaseClick: (dbConnection, database) => {
      dispatch(getDbTables(dbConnection, database));
      
    }
  }
};

const DatabasesContainer = connect(mapStateToProps, mapDispatchToProps)(Databases);

export default DatabasesContainer;
