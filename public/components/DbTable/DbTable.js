var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var Favorite = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  updateSelectedTable: function() {
    RethinkDbClient.updateSelectedTable(this.state.database.name, this.state.table.name);
    RethinkDbClient.getTableData(this.state.database.name, this.state.table.name);
  },
  render: function() {
    return (
      <div onClick={this.updateSelectedTable} className="db-table">
        <i className="fa fa-table"></i>
        <p>{this.state.table.name}</p>
      </div>
    );
  }
});

module.exports = Favorite;