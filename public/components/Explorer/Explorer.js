const React = require('react');
const ExplorerHeader = require('../ExplorerHeader/ExplorerHeader');
const ExplorerBody = require('../ExplorerBody/ExplorerBody');
const ExplorerFooter = require('../ExplorerFooter/ExplorerFooter');

const Explorer = () => {
  let content = (
    <div className="explorer-container">
      <div className="explorer-full-message">
        <p className="super-large-text">Connected!</p>
        <p className="">Start browsing your data by clicking on a database.</p>
        <p className="small-text">Having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.</p>
        {/* <p className="text-danger small-text">{this.state.selectedFavorite.dbConnection.msg}</p> */}
      </div>
    </div>
  );

  if (this.state.userConfig.favorites.length === 0) {
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
      if (this.state.selectedFavorite.dbConnection && this.state.selectedFavorite.dbConnection.name === 'ReqlDriverError') {
        content = (
          <div className="explorer-container">
            <div className="explorer-full-message">
              <p className="super-large-text">Woops!</p>
              <p className="">Something isn't right. Check your connection details.</p>
              <p className="small-text">Still having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.</p>
              <p className="text-danger small-text">{this.state.selectedFavorite.dbConnection.msg}</p>
            </div>
          </div>
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="body-content-col">
        {content}
    </div>
  );
};

module.exports = Explorer;
