import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { deleteConnection } from '../../../data/connections.actions';
import { showConnectionForm } from '../../../data/selectedConnection.actions';

const Toggle = ({ onClick }) => {
  return <i className="fa fa-bars connection-action-menu-button" onClick={onClick}/>;
};

const DatabasesHeader = ({
  editConnection,
  addDatabase,
  connections,
  onDeleteConnection,
  selectedConnection,
  connectionError
}) => {
  return (
    <div className="databases-header">
      <div>
        <span className="title">{selectedConnection && connections.length > 0 ? selectedConnection.name : ''}</span>
         { selectedConnection && connections.length > 0 ? 
          <Dropdown id="connection-dropdown" className="pull-right">
            <Toggle bsRole="toggle"/>
            <Dropdown.Menu className="super-colors">
              <MenuItem onClick={() => !!connectionError ? false : addDatabase()} disabled={!!connectionError}>Add database</MenuItem>
              <MenuItem divider/>
              <MenuItem onClick={() => {
                editConnection(selectedConnection)
              }}>Edit Connection</MenuItem>
              <MenuItem eventKey="3" onClick={() => {
                onDeleteConnection(selectedConnection)
              }}>Delete Connection</MenuItem>
            </Dropdown.Menu>
          </Dropdown> : ''}

      </div>
    </div>
  );
};


function mapStateToProps(state) {
  return {
    selectedConnection: state.connection.selected,
    connectionError: state.main.connectionError,
    connections: state.connections || [],
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    editConnection: function(connection) {
      dispatch(showConnectionForm(connection));
    },
    onDeleteConnection: function(connection) {
      if (confirm("Are you sure you want to delete the connection named " + connection.name)) {
        dispatch(deleteConnection(connection));
      }
    },
    addDatabase: function() {
      dispatch({
        type: "TOGGLE_DATABASE_FORM",
        showDatabaseForm: true
      });
    }
  }
};

const DatabasesHeaderContainer = connect(mapStateToProps, mapDispatchToProps)(DatabasesHeader);

module.exports = DatabasesHeaderContainer;
