import React from 'react';
import DbTables from './DbTables/DbTables';
import AddDbTable from './DbTables/AddDbTable';
import {connect} from 'react-redux';
import {deleteDatabase} from '../../../../actions';

const Database = React.createClass({
  getInitialState: function() {
    return {
      showDbTables: false
    }
  },
  render: function() {
    const {database, onDatabaseClick, onAddTable, deleteDatabase, editDatabase, dbConnection} = this.props;
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
            <button onClick={(e)=>deleteDatabase(e, database.name, dbConnection)} className="btn btn-default fa fa-trash"/>
            <button onClick={(e)=>editDatabase(e, database.name)} className="btn btn-default fa fa-pencil"/>
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
    deleteDatabase: function(e, dbName, connection) {
      e.stopPropagation();
      // let confirmDelete = () =>{
      //   return confirm(`Are you sure you want to permanently delete the database called "${dbName}"?`)
      // }
      // if(confirmDelete()){
        // console.log('delete confirmed');
        // dispatch(deleteDatabase(dbName, connection));
        dispatch({
          type:"TOGGLE_DELETE_DATABASE_FORM",
          dbToDelete: dbName,
          showDeleteDatabaseForm:true
        })
      // }
      
      // this.state.store.toggleEntityForm('Database', 'Delete', dbName);
    },
    editDatabase: function(dbName, e) {
      e.stopPropagation();
    },
  }
}

const DatabaseContainer = connect(mapStateToProps, mapDispatchToProps)(Database);

export default DatabaseContainer;
