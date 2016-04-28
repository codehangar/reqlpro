var React = require('react');
var classNames = require('classnames');
var ExplorerHeader = require('../ExplorerHeader/ExplorerHeader');
var ExplorerBody = require('../ExplorerBody/ExplorerBody');
var ExplorerFooter = require('../ExplorerFooter/ExplorerFooter');
var RethinkDbClient = window.rethinkDbClient;

var Explorer = React.createClass({
  getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    var content = <p className="select-table">Select a table from a database</p>;

    if (RethinkDbClient.favorites.length === 0) {
      content = (
        <div className="panel panel-default">
          <div className="panel-body text-center">
            <div><img className="start-logo" src="images/logo.png"/></div>
            <h2>No database connections added.</h2>
            <p>Click the <strong>"+"</strong> to add a RethinkDB connection.</p>
          </div>
        </div>
      );
    } else if (this.props.rethinkDbClient.selectedTable !== null) {
      content = (
        <div className="explorer-container">
          <ExplorerHeader table={this.props.rethinkDbClient.selectedTable}/>
          <ExplorerBody table={this.props.rethinkDbClient.selectedTable} width={this.props.width} />
          <ExplorerFooter table={this.props.rethinkDbClient.selectedTable} />
        </div>
      );
    } else if (this.props.rethinkDbClient.selectedFavorite.dbConnection !== null) {
      try {
        if (this.props.rethinkDbClient.selectedFavorite.dbConnection.name === 'ReqlDriverError') {
          content = <p className="text-danger">{this.props.rethinkDbClient.selectedFavorite.dbConnection.msg}</p>;
        }
      } catch (e) {
        console.log(e);
      }
    }

    return (
      <div className="body-content-col">
          {content}
      </div>
    );
  }
});

module.exports = Explorer;
