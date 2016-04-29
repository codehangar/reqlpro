var React = require('react');

var DbTable = React.createClass({
  getInitialState: function() {
    return this.context.store;
  },
  updateSelectedTable: function() {
    this.state.updateSelectedTable(this.props.database.name, this.props.table.name);
    this.state.query({
      page: 1,
      limit: 5
    });
    this.state.getTableSize();
  },
  render: function() {
    return (
      <div onClick={this.updateSelectedTable} className="db-table">
        <div><i className="fa fa-table"></i> {this.props.table.name}</div>
      </div>
    );
  }
});
DbTable.contextTypes = {
  store: React.PropTypes.object
};

module.exports = DbTable;
