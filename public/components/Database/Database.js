var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;
var DbTables = require('../DbTables/DbTables');

var Database = React.createClass({
	getInitialState: function() {
    var state = {
      databases: this.props.database,
      showTables: false
    }
    return this.props;
  },
  showTables: function() {
    var _this = this;
    RethinkDbClient.updateDbTables(this.state.database).then(function(database) {
      _this.setState({
        database: database,
        showTables: !_this.state.showTables
      });
    });
  },
  render: function() {
    var dbTables = '';
    if(this.state.showTables) {
      dbTables = <DbTables database={this.state.database} />;
    }
    return (
      <div className="database">
        <i className="fa fa-database"></i>
        <p onClick={this.showTables}>{this.state.database.name}</p>
        {dbTables}
      </div>
    );
  }
});

module.exports = Database;