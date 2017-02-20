import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import 'fixed-data-table/dist/fixed-data-table.css';
import JSONTree from 'react-json-tree';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import ExplorerTableCell from './ExplorerTableCell.js';
import Segment from '../../../../../services/segment.service';
import { refreshExplorerBody } from '../../../../../actions';
import { getColumnNames, getColumnWidth } from './explorer-table-view-utils';

const ExplorerTableView = ({
  width,
  table,
  columnWidths,
  selectedTable,
  onUpdateTableSort,
  onEditClick,
  onDeleteClick,
  setColumnWidth
}) => {

  // console.log('selectedTable----->', selectedTable);

  let columnNames = getColumnNames(selectedTable.data);

  const setColumnWidthCallback = (newColumnWidth, columnKey) => {
    setColumnWidth(newColumnWidth, columnKey, selectedTable)
  };

  const rowChanged = (row) => {
    // console.log("rowChanged row", row)
    // this.state.store.update(row);

    // Segment.track({
    //   event: 'selectedTableview.row.inlineEdit',
    //   properties: {}
    // });
  };

  const actionColumn = (
    <Column
      key="actions"
      header={<Cell>Action</Cell>}
      columnKey="action"
      cell={(props) => {
        const row = selectedTable.data[props.rowIndex];
        return (
          <Cell className="action-buttons">
            <span className="btn btn-sm btn-primary fa fa-pencil" onClick={() => onEditClick(row)}/>
            <span className="btn btn-sm btn-danger fa fa-trash" onClick={() => onDeleteClick(row)}/>
          </Cell>
        );
      }}
      width={100}/>
  );

  const dynamicColumns = columnNames.map((fieldName, index) => {
    const iconClasses = `fa fa-sort-${selectedTable.query.direction} pull-right`;
    let iconBody = '';
    if (selectedTable.query.sort === fieldName) {
      iconBody = <i className={iconClasses}/>;
    }
    const header = (
      <Cell className="tableview-header"
            onClick={() => onUpdateTableSort(selectedTable.query.sort, fieldName, selectedTable.query.direction)}>
        {fieldName}{iconBody}
      </Cell>
    );
    return (
      <Column
        key={index}
        header={header}
        isResizable={true}
        columnKey={fieldName}
        cell={(props) => {
          if (selectedTable.data[props.rowIndex].id === '11698a1f-f9db-4f9c-9fb8-4c27d75e1990' && fieldName === 'name') {
            // console.log("   --> ExplorerTableView cell render", this.props.table.data[props.rowIndex][fieldName])
          }
          return (
            <Cell>
              <ExplorerTableCell row={selectedTable.data[props.rowIndex]} fieldName={fieldName}
                                 rowChanged={rowChanged}/>
            </Cell>
          );
        }}
        width={getColumnWidth(columnWidths, selectedTable, fieldName)}
      />
    );
  });

  const columnNodes = [actionColumn].concat(dynamicColumns);

  return (
    <div style={{ position: 'relative' }}>
      <div className="table-view-container">
        <Table
          rowsCount={selectedTable.data.length}
          rowHeight={50}
          headerHeight={30}
          onColumnResizeEndCallback={setColumnWidthCallback}
          isColumnResizing={false}
          width={window.innerWidth - 360}
          height={window.innerHeight - 105}>
          {columnNodes}
        </Table>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    selectedTable: state.main.selectedTable,
    columnWidths: state.main.columnWidths,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateTableSort: (sort, field, direction) => {
      console.log('direction', direction, sort === field);
      if (sort === field) {
        direction = direction === 'asc' ? 'desc' : 'asc';
      }else{
        direction = 'desc'
      }
      dispatch({
        type: "SET_ORDER_BY_PREDICATE",
        orderByPredicate: `r.${direction}('${field}')`
      });
      dispatch(refreshExplorerBody());
    },
    setColumnWidth: (newColumnWidth, columnKey, selectedTable) => {
      let width = {};
      width[columnKey] = newColumnWidth;

      dispatch({
        type: "SET_TABLE_COLUMN_WIDTH",
        databaseName: selectedTable.databaseName,
        tableName: selectedTable.name,
        width
      });

      Segment.track({
        event: 'tableview.resizeColumn',
        properties: {}
      });
    },
    onEditClick: (row) => {
      dispatch({
        type: "SET_ROW_EDIT",
        row
      });

      Segment.track({
        event: 'tableview.row.editBtn',
        properties: {}
      });
    },
    onDeleteClick: (rowToDelete) => {
      dispatch({
        type: 'TOGGLE_CONFIRM_ROW_DELETE',
        rowToDelete
      });

      Segment.track({
        event: 'tableview.row.deleteBtn',
        properties: {}
      });
    }
  };
}

const ExplorerTableViewContainer = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableView);

export default ExplorerTableViewContainer;

// var ExplorerTableView = React.createClass({
//   getInitialState: function() {

//     var columnNames = [];
//     _.forEach(this.props.table.data, function(row) {
//       columnNames = columnNames.concat(Object.keys(row));
//     });
//     columnNames = _.uniq(columnNames);

//     // Sort columns aplhabetically, with id always coming first
//     columnNames.sort(function (a, b) {
//       if (a === 'id') {
//         return -1;
//       } else if (b === 'id') {
//         return 1;
//       } else if (a < b){
//         return -1;
//       } else if (a > b) {
//         return 1;
//       }
//       return 0;
//     });

//     let columnWidths = {};
//     columnNames.map((fieldName, index) => {
//       if (this.props.table.columnWidths  && this.props.table.columnWidths[fieldName]) {
//         columnWidths[fieldName] = this.props.table.columnWidths[fieldName];
//       } else if (fieldName === 'id') {
//         columnWidths[fieldName] = 274;
//       } else {
//         columnWidths[fieldName] = 200;
//       }
//     });

//     return {
//       columnWidths: columnWidths,
//       columnNames: columnNames,
//       store: this.context.store
//     };
//   },
//   componentWillReceiveProps: function() {
//     // console.log(" -> ExplorerTableView componentWillReceiveProps this.props", this.props)
//   },
//   _onColumnResizeEndCallback: function (newColumnWidth, columnKey) {
//     var width= {};
//     width[columnKey] = newColumnWidth;

//     // Update local state
//     this.setState(({columnWidths}) => ({
//       columnWidths: _.extend({}, columnWidths, width)
//     }));

//     // Also back up in the store to maintain across paging
//     var cWs = _.extend({}, this.props.table.columnWidths, width)
//     this.state.store.setColumnWidths(cWs);
//   },
//   rowChanged: function (row) {
//     // console.log("rowChanged row", row)
//     this.state.store.update(row);

//     Segment.track({
//       event: 'tableview.row.inlineEdit',
//       properties: {}
//     });
//   },
//   startEditRow: function (row) {
//     // console.log("startEditRow row", row)
//     this.state.store.startEdit(row);

//     Segment.track({
//       event: 'tableview.row.editBtn',
//       properties: {}
//     });
//   },
//   deleteRow: function (row) {
//     this.state.store.toggleConfirmRowDelete(row);
//     Segment.track({
//       event: 'tableview.row.deleteBtn',
//       properties: {}
//     });
//   },
//   sortTable: function(sort) {
//     this.state.store.updateTableSort(sort);
//     Segment.track({
//       event: 'tableview.row.headerSort',
//       properties: {}
//     });
//   },
//   render: function() {
//     // console.log(" --> ExplorerTableView render")

//     var _this = this;

//     var actionColumn = (
//       <Column
//         key="actions"
//         header={<Cell>Action</Cell>}
//         columnKey="action"
//         cell={(props) => {
//               const row = this.props.table.data[props.rowIndex];
//               return(
//                 <Cell className="action-buttons">
//                   <span className="btn btn-sm btn-primary fa fa-pencil" onClick={this.startEditRow.bind(this, row)}></span>
//                   <span className="btn btn-sm btn-danger fa fa-trash" onClick={this.deleteRow.bind(this, row)}></span>
//                 </Cell>
//               );
//             }
//         }
//         width={100} />
//     );

//     var columnNodes = this.state.columnNames.map((fieldName, index) => {
//       // console.log("  --> ExplorerTableView columnNodes", fieldName);
//       const iconClasses = classNames({
//         'fa': true,
//         'fa-sort-asc': this.props.table.query.direction,
//         'fa-sort-desc': !this.props.table.query.direction,
//         'pull-right': true
//       });
//       let iconBody = '';
//       if(this.props.table.query.sort === fieldName) {
//         iconBody = <i className={iconClasses}></i>;
//       }
//       return (
//         <Column
//           key={index}
//           header={<Cell className="tableview-header" onClick={this.sortTable.bind(this, fieldName)}>{fieldName}{iconBody}</Cell>}
//           isResizable={true}
//           columnKey={fieldName}
//           cell={(props) => {
//                 if (this.props.table.data[props.rowIndex].id === '11698a1f-f9db-4f9c-9fb8-4c27d75e1990' && fieldName === 'name') {
//                   // console.log("   --> ExplorerTableView cell render", this.props.table.data[props.rowIndex][fieldName])
//                 }
//                 return(
//                   <Cell>
//                     <ExplorerTableCell row={this.props.table.data[props.rowIndex]} fieldName={fieldName} rowChanged={this.rowChanged} />
//                   </Cell>
//                 );
//               }
//           }
//           width={this.state.columnWidths[fieldName]} />
//       );
//     });

//     // console.log("columnNodes", columnNodes)
//     columnNodes = [actionColumn].concat(columnNodes);
//     // console.log("columnNodes", columnNodes)

//     return (
//       <Table
//         rowsCount={this.props.table.data.length}
//         rowHeight={50}
//         headerHeight={30}
//         onColumnResizeEndCallback={this._onColumnResizeEndCallback}
//         isColumnResizing={false}
//         width={window.innerWidth - 360}
//         height={window.innerHeight - 105}>
//         {columnNodes}
//       </Table>
//     );
//   }
// });
// ExplorerTableView.contextTypes = {
//   store: React.PropTypes.object
// };

// module.exports = ExplorerTableView;
