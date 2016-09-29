import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

const DatabasesHeader = ({
  editFavorite,
  addDatabase,
  toggleConnectionActionMenu,
  showConnectionActionMenu,
  selectedConnection
}) => {
  var classes = {
    actionMenu: classNames(
      'dropdown-menu',
      {
        'show': showConnectionActionMenu,
        'hidden': !showConnectionActionMenu
      }
    )
  }
  return (
    <div className="databases-header">
      <div><span className="title">{selectedConnection ? selectedConnection.name : ''}</span>
        <div className="dropdown pull-right">
          <i onClick={toggleConnectionActionMenu} className="fa fa-bars connection-action-menu-button"></i>
          <ul className={classes.actionMenu}>
            <li onClick={() => {editFavorite(selectedConnection)}}><a href="#">Edit Connection</a></li>
            <li onClick={addDatabase}><a href="#">Add database</a></li>
          </ul>
        </div>
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
    },
    toggleConnectionActionMenu: function(event) {
      dispatch({
        type: "TOGGLE_CONNECTION_ACTION_MENU"
      });
    },
  }
};

const DatabasesHeaderContainer = connect(mapStateToProps, mapDispatchToProps)(DatabasesHeader);

module.exports = DatabasesHeaderContainer;
