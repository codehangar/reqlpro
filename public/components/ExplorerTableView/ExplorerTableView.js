const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');
import JSONTree from 'react-json-tree';
import ExplorerTableCell from './ExplorerTableCell.js';
import _ from 'lodash';
const classNames = require('classnames');
const Segment = require('../../services/segment.service');

var ExplorerTableView = React.createClass({
  getInitialState: function() {

    let maximumProps = 0;
    let rowIndexOfMaximum = 0;
    this.props.table.data.map(function(row, index) {
      maximumProps = Object.keys(row).length > maximumProps ? Object.keys(row).length : maximumProps;
      rowIndexOfMaximum = Object.keys(row).length >= maximumProps ? index : rowIndexOfMaximum;
    });

    let columnWidths = {};
    Object.keys(this.props.table.data[rowIndexOfMaximum]).map((fieldName, index) => {
      if (this.props.table.columnWidths  && this.props.table.columnWidths[fieldName]) {
        columnWidths[fieldName] = this.props.table.columnWidths[fieldName];
      } else {
        columnWidths[fieldName] = 200;
      }
    });

    return {
      columnWidths: columnWidths,
      store: this.context.store
    };
  },
  componentWillReceiveProps: function() {
    // console.log(" -> ExplorerTableView componentWillReceiveProps this.props", this.props)
  },
  _onColumnResizeEndCallback: function (newColumnWidth, columnKey) {
    var width= {};
    width[columnKey] = newColumnWidth;

    // Update local state
    this.setState(({columnWidths}) => ({
      columnWidths: _.extend({}, columnWidths, width)
    }));

    // Also back up in the store to maintain across paging
    var cWs = _.extend({}, this.props.table.columnWidths, width)
    this.state.store.setColumnWidths(cWs);
  },
  rowChanged: function (row) {
    // console.log("rowChanged row", row)
    this.state.store.update(row);
  },
  startEditRow: function (row) {
    // console.log("startEditRow row", row)
    this.state.store.startEdit(row);

    Segment.track({
      event: 'tableview.row.editBtn',
      properties: {}
    });
  },
  deleteRow: function (row) {
    this.state.store.deleteRow(row);

    Segment.track({
      event: 'tableview.row.deleteBtn',
      properties: {}
    });
  },
  sortTable: function(sort) {
    this.state.store.updateTableSort(sort);
  },
  render: function() {
    // console.log(" --> ExplorerTableView render")
    var maximumProps = 0; // Keep track of what has had the most props so far
    var rowIndexOfMaximum = 0; // The item in the data with the most props

    this.props.table.data.map(function(row, index) {
      maximumProps = Object.keys(row).length > maximumProps ? Object.keys(row).length : maximumProps;
      rowIndexOfMaximum = Object.keys(row).length >= maximumProps ? index : rowIndexOfMaximum;
    });

    var _this = this;

    var actionColumn = (
      <Column
        key="actions"
        header={<Cell>Action</Cell>}
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
      // console.log("  --> ExplorerTableView columnNodes", fieldName);
      const iconClasses = classNames({
        'fa': true,
        'fa-sort-asc': this.props.table.query.direction,
        'fa-sort-desc': !this.props.table.query.direction,
        'pull-right': true
      });
      let iconBody = '';
      if(this.props.table.query.sort === fieldName) {
        iconBody = <i className={iconClasses}></i>;
      }
      return (
        <Column
          key={index}
          header={<Cell className="tableview-header" onClick={this.sortTable.bind(this, fieldName)}>{fieldName}{iconBody}</Cell>}
          isResizable={true}
          columnKey={fieldName}
          cell={(props) => {
                if (this.props.table.data[props.rowIndex].id === '11698a1f-f9db-4f9c-9fb8-4c27d75e1990' && fieldName === 'name') {
                  // console.log("   --> ExplorerTableView cell render", this.props.table.data[props.rowIndex][fieldName])
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

    // console.log("columnNodes", columnNodes)
    columnNodes = [actionColumn].concat(columnNodes);
    // console.log("columnNodes", columnNodes)

    return (
      <Table
        rowsCount={this.props.table.data.length}
        rowHeight={50}
        headerHeight={30}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
        isColumnResizing={false}
        width={window.innerWidth - 360}
        height={window.innerHeight - 105}>
        {columnNodes}
      </Table>
    );
  }
});
ExplorerTableView.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ExplorerTableView;