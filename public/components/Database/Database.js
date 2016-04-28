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
    RethinkDbClient.updateDbTables(this.state.database).then((database) => {
      this.setState({
        database: database,
        showTables: !this.state.showTables
      });
    });
  },
  render: function() {
    var dbTables = '';
    if (this.state.showTables) {
      dbTables = <DbTables database={this.state.database} />;
    }
    return (
      <div className="database">
        
        <div className="db" onClick={this.showTables}><i className="fa fa-database"></i> {this.state.database.name}</div>
        {dbTables}
      </div>
    );
  }
});

module.exports = Database;
