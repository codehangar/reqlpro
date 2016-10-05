import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Dropdown, MenuItem} from 'react-bootstrap';


const DatabasesHeader = ({
  editFavorite,
  addDatabase,
  selectedConnection
}) => {
  return (
    <div className="databases-header">
      <div>
        <span className="title">{selectedConnection ? selectedConnection.name : ''}</span>
        <Dropdown id="connection-dropdown" className="pull-right">
          <i bsRole="toggle" className="fa fa-bars connection-action-menu-button" />
          <Dropdown.Menu className="super-colors">
            <MenuItem onClick={addDatabase}>Add database</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={() => {editFavorite(selectedConnection)}}>Edit Connection</MenuItem>
            <MenuItem eventKey="3">Delete Connection</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};


function mapStateToProps(state) {
  // console.log('DatabasesHeader state.main', state.main)
  return {
    selectedConnection: state.main.selectedConnection,
    showConnectionActionMenu: state.main.showConnectionActionMenu
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    editFavorite: function(selectedConnection) {
      dispatch({
        type: "SHOW_CONNECTION_FORM",
        mode: "EDIT",
        selectedConnection: selectedConnection
      });

      // this.props.store.showConnectionForm(this.props.selectedConnection);

      // The event is a "SyntheticMouseEvent" from React, so you have call all 3 version below to stop
      // the click from cascading down to the native event listeners. See:
      // http://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
      // event.stopPropagation();
      // event.nativeEvent.stopPropagation();
      // event.nativeEvent.stopImmediatePropagation();
    },
    addDatabase: function(e) {
      this.props.store.toggleEntityForm('Database', 'Add');
    }
  }
};

const DatabasesHeaderContainer = connect(mapStateToProps, mapDispatchToProps)(DatabasesHeader);

module.exports = DatabasesHeaderContainer;
