var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var Favorite = React.createClass({
  updateSelectedTable: function() {
    RethinkDbClient.updateSelectedTable(this.props.database.name, this.props.table.name);
    RethinkDbClient.getTableData(this.props.table.name);
    RethinkDbClient.getTableSize(this.props.table.name);
  },
  render: function() {
    return (
      <div onClick={this.updateSelectedTable} className="db-table">
        <i className="fa fa-table"></i>
        <p>{this.props.table.name}OK</p>
      </div>
    );
  }
});

module.exports = Favorite;
