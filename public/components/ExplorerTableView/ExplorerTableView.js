const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');
import JSONTree from 'react-json-tree';
import ExplorerTableCell from './ExplorerTableCell.js';
import _ from 'lodash';
var RethinkDbClient = window.rethinkDbClient;

var ExplorerTableView = React.createClass({
  getInitialState: function() {

    let maximumProps = 0;
    let rowIndexOfMaximum = 0;
    this.props.table.data.map(function(row, index) {
      maximumProps = Object.keys(row).length > maximumProps ? Object.keys(row).length : maximumProps;
      rowIndexOfMaximum = Object.keys(row).length > maximumProps ? index : rowIndexOfMaximum;
    });

    let columnWidths = {};
    Object.keys(this.props.table.data[rowIndexOfMaximum]).map((fieldName, index) => {
      columnWidths[fieldName] = 200;
    });

    return {
      columnWidths: columnWidths
    };
  },
  componentWillReceiveProps: function() {
    console.log(" -> ExplorerTableView componentWillReceiveProps this.props", this.props)
  },
  _onColumnResizeEndCallback: function (newColumnWidth, columnKey) {
    var width= {};
    width[columnKey] = newColumnWidth;
    this.setState(({columnWidths}) => ({
      columnWidths: _.extend({}, columnWidths, width)
    }));
  },
  rowChanged: function (row) {
    console.log("rowChanged row", row)
    RethinkDbClient.update(row);
  },
  startEditRow: function (row) {
    console.log("startEditRow row", row)
    RethinkDbClient.startEdit(row);
  },
  deleteRow: function (row) {
    console.log("deleteRow row", row)
  },
  render: function() {
    console.log(" --> ExplorerTableView render")
    var maximumProps = 0; // Keep track of what has had the most props so far
    var rowIndexOfMaximum = 0; // The item in the data with the most props

    this.props.table.data.map(function(row, index) {
      maximumProps = Object.keys(row).length > maximumProps ? Object.keys(row).length : maximumProps;
      rowIndexOfMaximum = Object.keys(row).length > maximumProps ? index : rowIndexOfMaximum;
    });

    var _this = this;

    var actionColumn = (
      <Column
        key="actions"
        header={<Cell>Action</Cell>}
        isResizable={true}
        columnKey="action"
        cell={(props) => {
              const row = this.props.table.data[props.rowIndex];
              return(
                <Cell className="action-buttons">
                  <span className="btn btn-sm btn-primary fa fa-pencil" onClick={this.startEditRow.bind(this, row)}></span>
                  <span className="btn btn-sm btn-danger fa fa-trash" onClick={this.deleteRow.bind(this, row)}></span>
                </Cell>
              );
            }
        }
        width={100} />
    );

    var columnNodes = Object.keys(this.props.table.data[rowIndexOfMaximum]).map((fieldName, index) => {
      console.log("  --> ExplorerTableView columnNodes", fieldName)
      return (
        <Column
          key={index}
          header={<Cell>{fieldName}</Cell>}
          isResizable={true}
          columnKey={fieldName}
          cell={(props) => {
                if (this.props.table.data[props.rowIndex].id === '11698a1f-f9db-4f9c-9fb8-4c27d75e1990' && fieldName === 'name') {
                  console.log("   --> ExplorerTableView cell render", this.props.table.data[props.rowIndex][fieldName])
                }
                return(
                  <Cell>
                    <ExplorerTableCell row={this.props.table.data[props.rowIndex]} fieldName={fieldName} rowChanged={this.rowChanged} />
                  </Cell>
                );
              }
          }
          width={this.state.columnWidths[fieldName]} />
      );
    });
    console.log("columnNodes", columnNodes)

    columnNodes = [actionColumn].concat(columnNodes);

    console.log("columnNodes", columnNodes)
    return (
      <Table
        rowsCount={this.props.table.data.length}
        rowHeight={50}
        headerHeight={30}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
        isColumnResizing={false}
        width={document.getElementById('explorer-body').offsetWidth}
        height={window.innerHeight - 100}>
        {columnNodes}
      </Table>
    );
  }
});

module.exports = ExplorerTableView;