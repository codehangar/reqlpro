const React = require('react');
const RethinkDbClient = window.rethinkDbClient;
const classNames = require('classnames');

const DatabasesHeader = React.createClass({
  editFavorite: function(e) {
    this.props.store.toggleConnectionForm(this.props.selectedFavorite);
  },
  toggleConnectionActionMenu: function(e) {
    this.props.store.toggleConnectionActionMenu();
  },
  addDatabase: function(e) {
    this.props.store.toggleDatabaseForm();
  },
  render: function() {
    var classes = {
      actionMenu: classNames(
        'connection-action-menu',
        'panel',
        'panel-default',
        {
          'show': this.props.store.router.connectionActionMenu.show,
          'hidden': !this.props.store.router.connectionActionMenu.show
        }
      )
    }
    return (
      <div className="databases-header">
        <div>{this.props.selectedFavorite.name} <i onClick={this.toggleConnectionActionMenu} className="fa fa-bars edit-connection"></i></div>
        <ul className={classes.actionMenu}>
          <li onClick={this.editFavorite}>Edit Connection</li>
          <li onClick={this.addDatabase}>Add database</li>
        </ul>
      </div>
    );
  }
});

module.exports = DatabasesHeader;
