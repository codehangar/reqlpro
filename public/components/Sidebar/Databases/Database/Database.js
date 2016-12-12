import React from 'react';
import DbTables from './DbTables/DbTables';
import AddDbTable from './DbTables/AddDbTable';
import {connect} from 'react-redux';

const Database = React.createClass({
  getInitialState: function() {
    return {
      showDbTables: false
    }
  },
  render: function() {
    const {database, onDatabaseClick, onAddTable, dbConnection, deleteDatabase, editDatabase} = this.props;
    return (
      <div className="database">

        <div className="db noselect" onClick={() => {
          onDatabaseClick(database);
          this.setState({
            showDbTables: !this.state.showDbTables
          })
        }}>
          <i className="fa fa-database"/>&nbsp;&nbsp;<span className="database-name">{database.name}</span>
          <div className="delete-db btn-group" role="group">
            <button onClick={deleteDatabase.bind(this, this.props.database.name)} className="btn btn-default fa fa-trash"/>
            {/*<button onClick={editDatabase.bind(this, this.props.database.name)} className="btn btn-default fa fa-pencil"/>*/}
          </div>
        </div>
        {this.state.showDbTables ?
          (<div className="db-tables noselect">
            <DbTables database={database}/>
            <AddDbTable onAddTable={() => onAddTable(database)}/>
          </div>) : ''}

      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    dbConnection: state.main.dbConnection
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onAddTable: (database) => {
      dispatch({
        type: 'TOGGLE_TABLE_FORM',
        showTableForm: true,
      });
      dispatch({
        type: 'SET_DB_TO_EDIT',
        database
      });
    },
    deleteDatabase: function(dbName, e) {
      e.stopPropagation();
      this.state.store.toggleEntityForm('Database', 'Delete', dbName);
    },
    editDatabase: function(dbName, e) {
      e.stopPropagation();
    },
  }
}

const DatabaseContainer = connect(mapStateToProps, mapDispatchToProps)(Database);

export default DatabaseContainer;
