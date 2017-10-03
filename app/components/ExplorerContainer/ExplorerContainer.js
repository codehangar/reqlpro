import React from 'react';
// import { Button } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import Explorer from'../Explorer/Explorer';
import ConnectedExplorerMessage from '../ConnectedExplorerMessage/ConnectedExplorerMessage';
import ReEnterPasswordExplorerMessage from '../ReEnterPasswordExplorerMessage/ReEnterPasswordExplorerMessage';
import GenericConnectionError from '../GenericConnectionError/GenericConnectionError';
import StartLogo from '../StartLogo/StartLogo';
import { connect } from 'react-redux';
// import logo from '../../images/logo.png';
import { showConnectionForm } from '../../data/selectedConnection.actions';

const ExplorerContainer = ({
 connections,
 connection,
 connectionError,
 selectedTable,
}) => {

  const isPasswordError = connectionError ? connectionError.error.msg === 'Unknown user' || connectionError.error.msg === 'Wrong password' : null;
  const connError = connectionError ? connectionError.error.msg || connectionError.error.message : '';

  const getContent = () => {
    if (connection.loading) {
      return <Loading/>;
    } else if (connectionError && connectionError.connection.name == connection.selected.name) {
      return isPasswordError ? <ReEnterPasswordExplorerMessage/> : <GenericConnectionError text={connError}/>;
    } else if (connections.length === 0) {
      return <StartLogo/>;
    } else if (selectedTable) {
      return <Explorer/>;
    } else {
      return <ConnectedExplorerMessage/>;
    }
  };

  return (
    <div className="body-content-col">
      <div className="explorer-container">
        {getContent()}
      </div>
    </div>
  );

};

const mapStateToProps = (state) => {
  return {
    connections: state.connections || [],
    connection: state.connection,
    selectedConnection: state.connection.selected,
    tableData: state.selectedTable ? state.selectedTable.data : null,
    selectedTable: state.selectedTable,
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

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerContainer);
