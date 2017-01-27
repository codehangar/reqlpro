import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { deleteConnection } from '../Connections/connections.actions';
import { showConnectionForm } from '../Connections/selectedConnection.actions';
import Segment from '../../../services/segment.service.js';

const Toggle = ({ onClick }) => {
  return <i className="fa fa-bars connection-action-menu-button" onClick={onClick}/>;
};

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
          <Toggle bsRole="toggle"/>
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
      Segment.track({
        event: 'connection.edit'
      });
    },
    onDeleteConnection: function(connection) {
      if (confirm("Are you sure you want to delete the connection named " + connection.name)) {
        dispatch(deleteConnection(connection));
        Segment.track({
          event: 'connection.delete'
        });
      }
    },
    addDatabase: function() {
      dispatch({
        type: "TOGGLE_DATABASE_FORM",
        showDatabaseForm: true
      });
      Segment.track({
        event: 'database.add'
      });
    }
  }
};

const DatabasesHeaderContainer = connect(mapStateToProps, mapDispatchToProps)(DatabasesHeader);

module.exports = DatabasesHeaderContainer;
