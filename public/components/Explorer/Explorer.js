import React from 'react';
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
  selectedTable,
  connectionError,
  editConnection,
  addConnection,
  selectedConnection
}) => {

  const HelpCenter = <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a>;


  const SendMessage = (
    <a className="clickable" onClick={() => {
      HS.beacon.open();
    }}>send us a message</a>
  );

  const TryAgain = (
    <a className='clickable' onClick={() => {
          editConnection(selectedConnection)
    }}>Try Again</a>

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
     //console.log('show Explorer Error ', connectionError.error.msg);
    const connError = (
       connectionError.error.msg
    ); 

    content = (
      <div className="explorer-container">
        <div className="explorer-full-message">
          <p className="super-large-text">Woops!</p>
          <p className="">Something isn't right. Check your connection details.</p>
    
         { (connectionError.error.msg == 'Unknown user' || connectionError.error.msg == 'Wrong password') ? 
          <Panel header={connError} bsStyle="danger">
                {TryAgain}
           </Panel>

           :  <pre className="text-danger">{connectionError.error.msg}</pre> }
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
          <div><img className="start-logo" src={logo}/></div>
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
    selectedConnection: state.connection.selected,
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

const ExplorerContainer = connect(mapStateToProps, mapDispatchToProps)(Explorer);

export default ExplorerContainer;
