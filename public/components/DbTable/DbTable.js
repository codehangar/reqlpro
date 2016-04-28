var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var Favorite = React.createClass({
  updateSelectedTable: function() {
    RethinkDbClient.updateSelectedTable(this.props.database.name, this.props.table.name);
    RethinkDbClient.query({
      page: 1,
      limit: 5
    });
    RethinkDbClient.getTableSize();
  },
  render: function() {
    return (
      <div onClick={this.updateSelectedTable} className="db-table">
        <div><i className="fa fa-table"></i> {this.props.table.name}</div>
      </div>
    );
  }
});

module.exports = Favorite;
