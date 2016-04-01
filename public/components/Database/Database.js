var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;
var DbTables = require('../DbTables/DbTables');

var Database = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  showTables: function() {
    var _this = this;
    RethinkDbClient.updateDbTables(this.state.database).then(function(database) {
      _this.setState({
        database: database
      });
    });
  },
  render: function() {
    return (
      <div onClick={this.showTables} className="database">
        <i className="fa fa-database"></i>
        <p>{this.state.database.name}</p>
        <DbTables database={this.state.database} />
      </div>
    );
  }
});

module.exports = Database;