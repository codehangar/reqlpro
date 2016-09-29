const React = require('react');
const ExplorerHeader = require('../ExplorerHeader/ExplorerHeader');
const ExplorerBody = require('../ExplorerBody/ExplorerBody');
const ExplorerFooter = require('../ExplorerFooter/ExplorerFooter');
import {connect} from 'react-redux';

const Explorer = ({
  connections,
  selectedConnection,
  selectedTable
}) => {

  console.log('connections',connections);

  let content = (
    <div className="explorer-container">
      <div className="explorer-full-message">
        <p className="super-large-text">Connected!</p>
        <p className="">Start browsing your data by clicking on a database.</p>
        <p className="small-text">Having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.</p>
        {/* <p className="text-danger small-text">{selectedConnection.dbConnection.msg}</p> */}
      </div>
    </div>
  );

  if (connections.length === 0) {
    content = (
      <div>
        <div className="text-center">
          <div><img className="start-logo" src="images/logo.png"/></div>
          <h2>No database connections added.</h2>
          <p>Click the <strong>"+"</strong> to add a RethinkDB connection.</p>
        </div>
      </div>
    );
  } else if (selectedTable) {
    // console.log("selectedTable", selectedTable)
    content = (
      <div className="explorer-container">
        <ExplorerHeader table={selectedTable} />
        <ExplorerBody table={selectedTable} />
        <ExplorerFooter table={selectedTable} />
      </div>
    );
  } else if (selectedConnection.dbConnection) {
    try {
      if (selectedConnection.dbConnection && selectedConnection.dbConnection.name === 'ReqlDriverError') {
        content = (
          <div className="explorer-container">
            <div className="explorer-full-message">
              <p className="super-large-text">Woops!</p>
              <p className="">Something isn't right. Check your connection details.</p>
              <p className="small-text">Still having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.</p>
              <p className="text-danger small-text">{selectedConnection.dbConnection.msg}</p>
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

const mapStateToProps = (state) => {
  console.log('Explorer  mapStateToProps', state.main);
  return {
    connections: state.main.connections || [],
    selectedConnection: state.main.selectedConnection,
    selectedTable: state.main.selectedTable
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const ExplorerContainer = connect(mapStateToProps, mapDispatchToProps)(Explorer);

module.exports = ExplorerContainer;
