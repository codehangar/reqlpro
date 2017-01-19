import React from 'react';
import ExplorerHeader from'./ExplorerHeader';
import ExplorerBody from'./ExplorerBody/ExplorerBody';
import ExplorerFooter from'./ExplorerFooter/ExplorerFooter';
import { connect } from 'react-redux';

const Explorer = ({
  connections,
  selectedConnection,
  dbConnection,
  selectedTable,
  connectionError
}) => {

  console.log('------------------------'); // eslint-disable-line no-console
  console.log({ connectionError, selectedTable, selectedConnection });
  console.log('connections', connections); // eslint-disable-line no-console

  let content = (
    <div className="explorer-container">
      <div className="explorer-full-message">
        <p className="super-large-text">Connected!</p>
        <p className="">Start browsing your data by clicking on a database.</p>
        <p className="small-text">Having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support"
                                                               target="_blank">Help Center</a> or <a
          onClick={function() {
            HS.beacon.open();
          }}>send us a message</a>.</p>
        {/* <p className="text-danger small-text">{dbConnection.msg}</p> */}
      </div>
    </div>
  );

  const connectionErrors = ['ReqlAuthError', 'ReqlDriverError'];

  if (connectionError && connectionError.connection.name == selectedConnection.name) {
    console.log('show Explorer Error');
    content = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          <p className="super-large-text">Woops!</p>
          <p className="">Something isn't right. Check your connection details.</p>
          <p className="small-text">Still having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support"
                                                                       target="_blank">Help Center</a> or <a
            onClick={function() {
              HS.beacon.open();
            }}>send us a message</a>.</p>
          <p className="text-danger small-text">{connectionError.error.msg}</p>
        </div>
      </div>
    );
  } else if (connections.length === 0) {
    console.log('show add a RethinkDB connection message');
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
    console.log('show Table Data');
    content = (
      <div className="explorer-container">
        <ExplorerHeader table={selectedTable}/>
        <ExplorerBody table={selectedTable}/>
        <ExplorerFooter table={selectedTable}/>
      </div>
    );
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
    connections: state.connections || [],
    selectedConnection: state.connection.selected,
    dbConnection: state.main.dbConnection,
    selectedTable: state.main.selectedTable,
    connectionError: state.main.connectionError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const ExplorerContainer = connect(mapStateToProps, mapDispatchToProps)(Explorer);

export default ExplorerContainer;
