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
  componentDidMount: function() {
    this.setupEvents(this.findDOMNode);
  },
  setupEvents: function() {
    var _this = this;
    // Event for updating selected table data
    console.log("   --> ExplorerBody updateSelectedTable")
    RethinkDbClient.on('updateSelectedTable', function() {
      _this.setState({
        table: RethinkDbClient.selectedTable
      });
    });
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
    } else if (RethinkDbClient.selectedTable !== null) {
      content = (
        <div className="explorer-container">
          <ExplorerHeader table={RethinkDbClient.selectedTable}/>
          <ExplorerBody table={RethinkDbClient.selectedTable} width={this.props.width} />
          <ExplorerFooter table={RethinkDbClient.selectedTable} />
        </div>
      );
    } else if (RethinkDbClient.selectedFavorite.dbConnection !== null) {
      try {
        if (RethinkDbClient.selectedFavorite.dbConnection.name === 'ReqlDriverError') {
          content = (
            <div className="jumbotron">
              <p className="text-danger">{RethinkDbClient.selectedFavorite.dbConnection.msg}</p>
            </div>
          );
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
