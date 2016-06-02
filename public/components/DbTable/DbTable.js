var React = require('react');

var DbTable = React.createClass({
  // isSelected: false,
  getInitialState: function() {
    console.log('state', this.context.store);
    return this.context.store;
  },
  updateSelectedTable: function() {
    // this.isSelected = false;
    this.state.updateSelectedTable(this.props.database.name, this.props.table.name);
    this.state.query();
    this.state.getTableSize();
    this.isSelected = this.props.table.name === this.state.selectedTable.name;
    console.log('this.state.selectedTable',this.state.selectedTable)
  },
  render: function() {
    return (
      <div onClick={this.updateSelectedTable} className={"db-table "+ (this.state.selectedTable && (this.state.selectedTable.name === this.props.table.name) ? 'selected' : '')}>
        <div><i className="fa fa-table"></i> {this.props.table.name}</div>
      </div>
    );
  }
});
DbTable.contextTypes = {
  store: React.PropTypes.object
};

module.exports = DbTable;
