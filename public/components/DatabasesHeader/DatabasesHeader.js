import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

const DatabasesHeader = React.createClass({
  render: function() {
    const {editFavorite, addDatabase, toggleConnectionActionMenu} = this.props;
    console.log('DatabasesHeader', this.props)
    const {selectedFavorite} = this.props;
    var classes = {
      actionMenu: classNames(
        'dropdown-menu',
        {
          'show': this.props.showConnectionActionMenu,
          'hidden': !this.props.showConnectionActionMenu
        }
      )
    }
    return (
      <div className="databases-header">
        <div><span className="title">{this.props.selectedFavorite ? this.props.selectedFavorite.name : ''}</span>
          <div className="dropdown pull-right">
            <i onClick={toggleConnectionActionMenu} className="fa fa-bars connection-action-menu-button"></i>
            <ul className={classes.actionMenu}>
              <li onClick={() => {editFavorite(selectedFavorite)}}><a href="#">Edit Connection</a></li>
              <li onClick={addDatabase}><a href="#">Add database</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});


function mapStateToProps(state) {
  console.log('DatabasesHeader state', state)
  return {
    selectedFavorite: state.selectedFavorite,
    showConnectionActionMenu: state.showConnectionActionMenu
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    editFavorite: function(event) {
      this.props.store.showConnectionForm(this.props.selectedFavorite);

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

      const documentClickListener = () => {
        window.document.removeEventListener('click', documentClickListener, false);
        dispatch({
          type: "TOGGLE_CONNECTION_ACTION_MENU"
        });
      };
      window.document.addEventListener('click', documentClickListener, false);
    },
  }
};

const DatabasesHeaderContainer = connect(mapStateToProps, mapDispatchToProps)(DatabasesHeader);

module.exports = DatabasesHeaderContainer;
