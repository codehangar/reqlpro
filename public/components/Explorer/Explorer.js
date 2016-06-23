const React = require('react');
const ExplorerHeader = require('../ExplorerHeader/ExplorerHeader');
const ExplorerBody = require('../ExplorerBody/ExplorerBody');
const ExplorerFooter = require('../ExplorerFooter/ExplorerFooter');

const Explorer = React.createClass({
  getInitialState: function() {
    return this.context.store;
  },
  componentDidMount: function() {
    this.setupEvents();
  },
  setupEvents: function() {
    this.state.on('updateSelectedTable', () => {
      // console.log("   --> ExplorerBody updateSelectedTable")
      this.forceUpdate();
    });
  },
  render: function() {
    let content = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          <p className="select-table">Select a table from a database</p>
        </div>
      </div>
    );

    if (this.state.favorites.length === 0) {
      content = (
        <div className="panel panel-default">
          <div className="panel-body text-center">
            <div><img className="start-logo" src="images/logo.png"/></div>
            <h2>No database connections added.</h2>
            <p>Click the <strong>"+"</strong> to add a RethinkDB connection.</p>
          </div>
        </div>
      );
    } else if (this.state.selectedTable !== null) {
      // console.log("this.state.selectedTable", this.state.selectedTable)
      content = (
        <div className="explorer-container">
          <ExplorerHeader table={this.state.selectedTable} store={this.state} />
          <ExplorerBody table={this.state.selectedTable} width={this.props.width} />
          <ExplorerFooter table={this.state.selectedTable} store={this.state} />
        </div>
      );
    } else if (this.state.selectedFavorite.dbConnection !== null) {
      try {
        if (this.state.selectedFavorite.dbConnection.name === 'ReqlDriverError') {
          content = (
            <div className="explorer-container">
              <div className="explorer-full-message">
                <p className="text-danger">{this.state.selectedFavorite.dbConnection.msg}</p>
              </div>
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
Explorer.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Explorer;
