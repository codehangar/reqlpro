import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { deleteConnection } from '../Connections/connections.actions';
import { showConnectionForm } from '../Connections/selectedConnection.actions';

const DatabasesHeader = ({
  editConnection,
  addDatabase,
  onDeleteConnection,
  selectedConnection
}) => {
  return (
    <div className="databases-header">
      <div>
        <span className="title">{selectedConnection ? selectedConnection.name : ''}</span>
        <Dropdown id="connection-dropdown" className="pull-right">
          <i bsRole="toggle" className="fa fa-bars connection-action-menu-button"/>
          <Dropdown.Menu className="super-colors">
            <MenuItem onClick={addDatabase}>Add database</MenuItem>
            <MenuItem divider/>
            <MenuItem onClick={() => {
              editConnection(selectedConnection)
            }}>Edit Connection</MenuItem>
            <MenuItem eventKey="3" onClick={() => {
              onDeleteConnection(selectedConnection)
            }}>Delete Connection</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};


function mapStateToProps(state) {
  return {
    selectedConnection: state.connection.selected
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
