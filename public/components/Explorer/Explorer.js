import React from 'react';
import ExplorerHeader from'./ExplorerHeader';
import ExplorerBody from'./ExplorerBody/ExplorerBody';
import ExplorerFooter from'./ExplorerFooter/ExplorerFooter';
import {connect} from 'react-redux';

const Explorer = ({
  connections,
  selectedConnection,
  dbConnection,
  selectedTable
}) => {

  let content = (
    <div className="explorer-container">
      <div className="explorer-full-message">
        <p className="super-large-text">Connected!</p>
        <p className="">Start browsing your data by clicking on a database.</p>
        <p className="small-text">Having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.</p>
        {/* <p className="text-danger small-text">{dbConnection.msg}</p> */}
      </div>
    </div>
  );

  const connectionErrors = ['ReqlAuthError', 'ReqlDriverError'];

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
  } else if (dbConnection) {
    try {
      if (dbConnection && connectionErrors.indexOf(dbConnection.name) !== -1) {
        content = (
          <div className="explorer-container">
            <div className="explorer-full-message">
              <p className="super-large-text">Woops!</p>
              <p className="">Something isn't right. Check your connection details.</p>
              <p className="small-text">Still having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.</p>
              <p className="text-danger small-text">{dbConnection.msg}</p>
            </div>
          </div>
        );
      }
      else if (selectedTable) {
    content = (
      <div className="explorer-container">
        <ExplorerHeader table={selectedTable} />
        <ExplorerBody table={selectedTable} />
        <ExplorerFooter table={selectedTable} />
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
  // console.log('Explorer  mapStateToProps', state.main);
  return {
    connections: state.main.connections || [],
    selectedConnection: state.main.selectedConnection,
    dbConnection: state.main.dbConnection,
    selectedTable: state.main.selectedTable
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const ExplorerContainer = connect(mapStateToProps, mapDispatchToProps)(Explorer);

export default ExplorerContainer;
