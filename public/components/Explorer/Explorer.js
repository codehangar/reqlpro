var React = require('react');
var classNames = require('classnames');
var ExplorerHeader = require('../ExplorerHeader/ExplorerHeader');
var ExplorerBody = require('../ExplorerBody/ExplorerBody');
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
            <div><img src="http://placehold.it/250x250"/></div>
            <h2>No database connections added.</h2>
            <p>Click the <strong>"+"</strong> to add a RethinkDB connection.</p>
          </div>
        </div>
      );
    } else if (this.props.rethinkDbClient.selectedTable !== null) {
      content = (
        <div>
          <ExplorerHeader table={this.props.rethinkDbClient.selectedTable} width={this.props.width} />
          <ExplorerBody table={this.props.rethinkDbClient.selectedTable} width={this.props.width} />
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
      <div className="col-md-9 main-content-col no-float" width={{
        width: this.props.width
      }}>
          {content}
      </div>
    );
  }
});

module.exports = Explorer;
