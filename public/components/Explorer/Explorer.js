import React from 'react';
import ExplorerHeader from'./ExplorerHeader/ExplorerHeader';
import ExplorerBody from'./ExplorerBody/ExplorerBody';
import ExplorerFooter from'./ExplorerFooter/ExplorerFooter';
import { connect } from 'react-redux';

const Explorer = ({
  connections,
  connection,
  selectedTable,
  connectionError
}) => {

  const HelpCenter = <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a>;
  const SendMessage = (
    <a className="clickable" onClick={() => {
      HS.beacon.open();
    }}>send us a message</a>
  );

  let content = (
    <div className="explorer-container">
      <div className="explorer-full-message">
        <p className="super-large-text">Connected!</p>
        <p className="">Start browsing your data by clicking on a database.</p>
        <p className="small-text">
          Having trouble? Visit our {HelpCenter} or {SendMessage}.
        </p>
      </div>
    </div>
  );

  const connectionErrors = ['ReqlAuthError', 'ReqlDriverError'];

  if (connection.loading) {
    content = (
      <div className="explorer-container">
        <div className="explorer-loading">
          <span className="fa fa-refresh fa-spin"/>
        </div>
      </div>
    );
  } else if (connectionError && connectionError.connection.name == connection.selected.name) {
    // console.log('show Explorer Error');
    content = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          <p className="super-large-text">Woops!</p>
          <p className="">Something isn't right. Check your connection details.</p>
          <pre className="text-danger">{connectionError.error.msg}</pre>
          <p className="small-text">
            Still having trouble? Visit our {HelpCenter} or {SendMessage}.
          </p>
        </div>
      </div>
    );
  } else if (connections.length === 0) {
    // console.log('show add a RethinkDB connection message');
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
    // console.log('show Table Data');
    content = (
      <div className="explorer-container">
        <ExplorerHeader table={selectedTable}/>
        <ExplorerBody table={selectedTable}/>
        <ExplorerFooter/>
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
  return {
    connections: state.connections || [],
    connection: state.connection,
    selectedTable: state.main.selectedTable,
    connectionError: state.main.connectionError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const ExplorerContainer = connect(mapStateToProps, mapDispatchToProps)(Explorer);

export default ExplorerContainer;
