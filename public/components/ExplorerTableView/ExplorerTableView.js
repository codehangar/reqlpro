const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');
import InlineEdit from 'react-edit-inline';
import JSONTree from 'react-json-tree';
import ExplorerTableCell from './ExplorerTableCell.js'
var RethinkDbClient = window.rethinkDbClient;

var ExplorerTableView = React.createClass({
  rowChanged: function (row) {
    console.log("rowChanged row", row)
    RethinkDbClient.update(this.props.table.name, row);
  },
  render: function() {
    var maximumProps = 0; // Keep track of what has had the most props so far
    var rowIndexOfMaximum = 0; // The item in the data with the most props

    this.props.table.data.map(function(row, index) {
      maximumProps = Object.keys(row).length > maximumProps ? Object.keys(row).length : maximumProps;
      rowIndexOfMaximum = Object.keys(row).length > maximumProps ? index : rowIndexOfMaximum;
    });

    var _this = this;
    var columnNodes = Object.keys(this.props.table.data[rowIndexOfMaximum]).map((fieldName, index) => {
      return (
        <Column
          key={index}
          header={<Cell>{fieldName}</Cell>}
          cell={props => (
            <Cell>
              <ExplorerTableCell row={this.props.table.data[props.rowIndex]} fieldName={fieldName} rowChanged={this.rowChanged} />
            </Cell>
          )}
          width={200} />
      );
    });
    return (
      <Table
        rowsCount={this.props.table.data.length}
        rowHeight={50}
        headerHeight={30}
        width={document.getElementById('explorer-body').offsetWidth}
        height={window.innerHeight - 100}>
        {columnNodes}
      </Table>
    );
  }
});

module.exports = ExplorerTableView;