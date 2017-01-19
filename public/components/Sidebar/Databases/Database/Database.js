import React from 'react';
import DbTables from './DbTables/DbTables';
import AddDbTable from './DbTables/AddDbTable';
import { connect } from 'react-redux';
import { deleteDatabase } from '../../../../actions';
import { getDbTables } from './DbTables/tables.actions';

const Database = React.createClass({
  render: function() {
    const { database, tables, getDbTables, onAddTable, toggleTableVisibility, deleteDatabase, editDatabase, dbConnection } = this.props;

    const onDbClick = () => {
      if (!database.showTables) {
        getDbTables(dbConnection, database.name);
      }
      toggleTableVisibility(database);
    };

    let tableNodes = (
      <div className="db-tables noselect">
        <DbTables database={database} tables={tables[database.name]}/>
        <AddDbTable onAddTable={() => onAddTable(database)}/>
      </div>
    );

    return (
      <div className="database">
        <div className="db noselect" onClick={onDbClick}>
          <i className="fa fa-database"/>&nbsp;&nbsp;<span className="database-name">{database.name}</span>
          <div className="delete-db btn-group" role="group">
            <button onClick={(e) => deleteDatabase(e, database.name)}
                    className="btn btn-default fa fa-trash"/>
            <button onClick={(e) => editDatabase(e, database.name)} className="btn btn-default fa fa-pencil"/>
          </div>
        </div>
        {database.showTables ? tableNodes : ''}
      </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    dbConnection: state.main.dbConnection,
    tables: state.tables
  };
};

const mapDispatchToProps = (dispatch) => {
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
    toggleTableVisibility: (database) => {
      dispatch({
        type: 'TOGGLE_TABLE_VISIBILITY',
        database,
        showTables: !database.showTables
      });
    },
    getDbTables: (dbConnection, database) => {
      dispatch(getDbTables(dbConnection, database));
    },
    deleteDatabase: function(e, dbName) {
      e.stopPropagation();
      dispatch({
        type: "TOGGLE_DELETE_DATABASE_FORM",
        dbToDelete: dbName,
        showDeleteDatabaseForm: true
      });
    },
    editDatabase: function(dbName, e) {
      e.stopPropagation();
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Database);
