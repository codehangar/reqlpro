const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');

var ExplorerTableView = React.createClass({
  getInitialState: function() {
    return this.props;
  },
  componentWillMount: function() {

  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    return (
      <Table
        rowsCount={this.state.data.length}
        rowHeight={50}
        headerHeight={50}
        width={document.getElementById('explorer-body').offsetWidth}
        height={window.innerHeight - 100}>
        <Column
          header={<Cell>Id</Cell>}
          cell={props => (
            <Cell {...props}>
              {this.state.data[props.rowIndex].id}
            </Cell>
          )}
          width={200}
        />
      </Table>
    );
  }
});

module.exports = ExplorerTableView;