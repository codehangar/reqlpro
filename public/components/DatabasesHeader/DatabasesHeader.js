const React = require('react');
const RethinkDbClient = window.rethinkDbClient;
const classNames = require('classnames');

const DatabasesHeader = React.createClass({
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
    this.props.store.toggleConnectionActionMenu();

    const documentClickListener = () => {
      window.document.removeEventListener('click', documentClickListener, false);
      this.props.store.toggleConnectionActionMenu();
    };
    window.document.addEventListener('click', documentClickListener, false);
  },
  render: function() {
    console.log('DatabasesHeader', this.props)
    const {selectedFavorite} = this.props;
    var classes = {
      actionMenu: classNames(
        'dropdown-menu',
        {
          'show': true, //this.props.store.router.ConnectionActionMenu.show,
          'hidden': false //!this.props.store.router.ConnectionActionMenu.show
        }
      )
    }
    return (
      <div className="databases-header">
        <div><span className="title"></span>
          <div className="dropdown pull-right">
            <i onClick={this.toggleConnectionActionMenu} className="fa fa-bars connection-action-menu-button"></i>
            <ul className={classes.actionMenu}>
              <li onClick={this.editFavorite}><a href="#">Edit Connection</a></li>
              <li onClick={this.addDatabase}><a href="#">Add database</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DatabasesHeader;
