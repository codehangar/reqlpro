import React from 'react';
import { Button } from 'react-bootstrap';
import ExplorerHeader from'./ExplorerHeader/ExplorerHeader';
import ExplorerBody from'./ExplorerBody/ExplorerBody';
import ExplorerFooter from'./ExplorerFooter/ExplorerFooter';
import { connect } from 'react-redux';
import logo from '../../images/logo.png';
import addConnection from '../Sidebar/Connections/AddConnection';
import { showConnectionForm } from '../Sidebar/Connections/selectedConnection.actions';
import { Panel } from 'react-bootstrap';


const Explorer = ({
  connections,
  connection,
  tableData,
  connectionError,
  editConnection,
  addConnection,
  selectedConnection
}) => {

  const passwordError = connectionError ? connectionError.error.msg == 'Unknown user' || connectionError.error.msg == 'Wrong password' : null;

  const HelpCenter = <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a>;

  const SendMessage = (
    <a className="clickable" onClick={() => {
      HS.beacon.open();
    }}>send us a message</a>
  );

  const TryAgain = (
    <Button bsSize="large" style={{ margin: 16 }} onClick={() => {
      editConnection(selectedConnection)
    }}>Re-enter my Password</Button>
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
    const connError = (
      connectionError.error.msg
    );

    content = (
      <div className="explorer-container">
        <div className="explorer-full-message">

          { passwordError ?
            <span>
             <p className="super-large-text">Disconnected!</p>
             <p className="">Please re-enter your password to connect.</p>
              {TryAgain}
           </span>

            :
            <span>
             <p className="super-large-text">Woops!</p>

             <pre className="text-danger">{connectionError.error.msg}</pre>
           </span>}
          <p className="small-text">
            Still having trouble? Visit our {HelpCenter} or {SendMessage}.
          </p>
        </div>
      </div>
    );
  } else if (connections.length === 0) {
    content = (
      <div>
        <div className="text-center">
          <div><img className="start-logo" src={logo}/></div>
          <h2>No database connections added.</h2>
          <p>Click the <strong>"+"</strong> to add a RethinkDB connection.</p>
        </div>
      </div>
    );
  } else if (tableData) {
    content = (
      <div className="explorer-container">
        <ExplorerHeader/>
        <ExplorerBody/>
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
    selectedConnection: state.connection.selected,
    tableData: state.main.selectedTable ? state.main.selectedTable.data : null,
    connectionError: state.main.connectionError,
    addConnection: state.main.addConnection
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editConnection: function(connection) {
      dispatch(showConnectionForm(connection));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
