import React from 'react';
import { Button } from 'react-bootstrap';
import ExplorerHeader from'./ExplorerHeader/ExplorerHeader';
import ExplorerBody from'./ExplorerBody/ExplorerBody';
import ExplorerFooter from'./ExplorerFooter/ExplorerFooter';
import { connect } from 'react-redux';
import logo from '../../images/logo.png';
import { HelpCenter, SendMessage } from '../generic/support-links';
import { showConnectionForm } from '../Sidebar/Connections/selectedConnection.actions';


const Explorer = ({
  connections,
  connection,
  tableData,
  connectionError,
  editConnection,
  addConnection,
  selectedTable,
  selectedConnection
}) => {

  const isPasswordError = connectionError ? connectionError.error.msg === 'Unknown user' || connectionError.error.msg === 'Wrong password' : null;
  const connError = connectionError ? connectionError.error.msg || connectionError.error.message : '';

  let content;

  const Loading = (
    <div className="explorer-container">
      <div className="explorer-loading">
        <span className="fa fa-refresh fa-spin"/>
      </div>
    </div>
  );

  const Connected = (
    <div className="explorer-container">
      <div className="explorer-full-message">
        <p className="super-large-text">Connected!</p>
        <p className="">Start browsing your data by clicking on a database.</p>
        <p className="small-text">
          Having trouble? Visit our <HelpCenter/> or <SendMessage/>.
        </p>
      </div>
    </div>
  );

  const ReEnterPassword = (
    <div>
      <p className="super-large-text">Disconnected!</p>
      <p className="">Please re-enter your password to connect.</p>
      <Button bsSize="large" style={{ margin: 16 }} onClick={() => {
        editConnection(selectedConnection)
      }}>Re-enter my Password</Button>
    </div>
  );

  const GenericConnectionError = (
    <div>
      <p className="super-large-text">Oops!</p>
      <pre className="text-danger">{connError}</pre>
    </div>
  );

  if (connection.loading) {
    content = Loading;
  } else if (connectionError && connectionError.connection.name == connection.selected.name) {
    content = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          { isPasswordError ? ReEnterPassword : GenericConnectionError }
          <p className="small-text">
            Still having trouble? Visit our <HelpCenter/> or <SendMessage/>.
          </p>
        </div>
      </div>
    );
  } else if (connections.length === 0) {
    content = (
      <div className="explorer-container">
        <div className="text-center">
          <div><img className="start-logo" src={logo}/></div>
          <h2>No database connections added.</h2>
          <p>Click the <strong>"+"</strong> to add a RethinkDB connection.</p>
        </div>
      </div>
    );
  } else if (selectedTable) {
    content = (
      <div className="explorer-container">
        <ExplorerHeader/>
        <ExplorerBody/>
        <ExplorerFooter/>
      </div>
    );
  } else {
    content = Connected;
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
    selectedTable: state.main.selectedTable,
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
