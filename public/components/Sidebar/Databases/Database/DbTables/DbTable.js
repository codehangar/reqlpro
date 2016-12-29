import React from'react';
import {connect} from 'react-redux';
import {queryTable} from '../../../../../actions';

const DbTable = ({
  dbConnection,
  selectedTable,
  table,
  database,
  onTableClick,
  deleteTable
}) => {
  return (
    <div onClick={() => onTableClick(dbConnection, database.name, table, selectedTable)} className={"db-table " + (selectedTable && (selectedTable.name === table) ? 'selected' : '')}>
      <div>
        <i className="fa fa-table"/> {table}
        <div className="delete-table btn-group" role="group">
          <button onClick={(e) => deleteTable(e, database, table)} className="btn btn-default fa fa-trash"/>
           {/*<button onClick={this.editDatabase.bind(this, this.props.database.name)} className="btn btn-default fa fa-pencil"></button>*!/*/}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    dbConnection: state.main.dbConnection,
    selectedTable: state.main.selectedTable || null
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onTableClick: (dbConnection, databaseName, tableName, selectedTable) => {
      console.log('on table click', databaseName, tableName)
      dispatch({
        type: "SET_SELECTED_TABLE",
        databaseName,
        tableName
      });
      selectedTable ? dispatch(queryTable(dbConnection, databaseName, tableName, selectedTable.query)) :
        dispatch(queryTable(dbConnection, databaseName, tableName))
      // ;
      // dispatch({
      //   type: "GET_TABLE_DATA",
      //   databaseName,
      //   tableName
      // });
    },
    deleteTable: (e, database, table) =>{
      console.log('deleteTable',table)
      e.stopPropagation();

      dispatch({
        type:"TOGGLE_DELETE_TABLE_FORM",
        tableToDelete: table,
        database,
        showDeleteTableForm:true
      })

    }
  }
}

const DbTableContainer = connect(mapStateToProps, mapDispatchToProps)(DbTable);

export default DbTableContainer;

// var DbTable = React.createClass({
//   // isSelected: false,
//   getInitialState: function() {
//     console.log('state', this.context.store);
//     return this.context.store;
//   },
//   deleteTable: function(tableName, e) {
//     e.stopPropagation();
//     this.state.toggleEntityForm('Table', 'Delete', tableName);
//   },
//   updateSelectedTable: function() {
//     // this.isSelected = false;
//     this.state.updateSelectedTable(this.props.database.name, this.props.table);
//     this.state.query();
//     this.state.getTableSize();
//     this.isSelected = this.props.table === this.state.selectedTable.name;
//     console.log('this.state.selectedTable',this.state.selectedTable)
//   },
//   render: function() {
//     return (
//       <div onClick={this.updateSelectedTable} className={"db-table "+ (this.state.selectedTable && (this.state.selectedTable.name === this.props.table) ? 'selected' : '')}>
//         <div>
//           <i className="fa fa-table"></i> {this.props.table}
//           <div className="delete-table btn-group" role="group">
//             <button onClick={this.deleteTable.bind(this, this.props.table)} className="btn btn-default fa fa-trash"></button>
//             {/*<button onClick={this.editDatabase.bind(this, this.props.database.name)} className="btn btn-default fa fa-pencil"></button>*/}
//           </div>
//         </div>
//       </div>
//     );
//   }
// });
// DbTable.contextTypes = {
//   store: React.PropTypes.object
// };

// module.exports = DbTable;
