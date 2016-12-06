var React = require('react');

var DbTable = React.createClass({
  // isSelected: false,
  getInitialState: function() {
    console.log('state', this.context.store);
    return this.context.store;
  },
  deleteTable: function(tableName, e) {
    e.stopPropagation();
    this.state.toggleEntityForm('Table', 'Delete', tableName);
  },
  updateSelectedTable: function() {
    // this.isSelected = false;
    this.state.updateSelectedTable(this.props.database.name, this.props.table);
    this.state.query();
    this.state.getTableSize();
    this.isSelected = this.props.table === this.state.selectedTable.name;
    console.log('this.state.selectedTable',this.state.selectedTable)
  },
  render: function() {
    return (
      <div onClick={this.updateSelectedTable} className={"db-table "+ (this.state.selectedTable && (this.state.selectedTable.name === this.props.table) ? 'selected' : '')}>
        <div>
          <i className="fa fa-table"></i> {this.props.table}
          <div className="delete-table btn-group" role="group">
            <button onClick={this.deleteTable.bind(this, this.props.table)} className="btn btn-default fa fa-trash"></button>
            {/*<button onClick={this.editDatabase.bind(this, this.props.database.name)} className="btn btn-default fa fa-pencil"></button>*/}
          </div>
        </div>
      </div>
    );
  }
});
DbTable.contextTypes = {
  store: React.PropTypes.object
};

module.exports = DbTable;
