var React = require('react');
var classNames = require('classnames');
var ExplorerHeader = require('../ExplorerHeader/ExplorerHeader');
var ExplorerBody = require('../ExplorerBody/ExplorerBody');

var Explorer = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    var content = <p className="select-table">Select a table from a database</p>;
    if(this.state.rethinkDbClient.selectedTable !== null) {
      content = <div><ExplorerHeader selectedTable={this.state.rethinkDbClient.selectedTable} /><ExplorerBody selectedTable={this.state.rethinkDbClient.selectedTable} /></div>;
    }
    if(this.state.rethinkDbClient.selectedFavorite.dbConnection !== null) {
      console.log(this.state.rethinkDbClient.selectedFavorite.dbConnection);
      try {
        if(this.state.rethinkDbClient.selectedFavorite.dbConnection.name === 'ReqlDriverError') {
          content = <p className="text-danger">{this.state.rethinkDbClient.selectedFavorite.dbConnection.msg}</p>;
        }
      } catch(e) {
        console.log(e);
      }
    }
    return (
      <div className="col-md-9 main-content-col no-float">
        {content}
      </div>
    );
  }
});

module.exports = Explorer;