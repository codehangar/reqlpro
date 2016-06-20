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
    this.props.store.toggleEntityForm('Database', 'Add');
  },
  render: function() {
    var classes = {
      actionMenu: classNames(
        'dropdown-menu',
        {
          'show': this.props.store.router.ConnectionActionMenu.show,
          'hidden': !this.props.store.router.ConnectionActionMenu.show
        }
      )
    }
    return (
      <div className="databases-header">
        <div><span className="title">{this.props.selectedFavorite.name}</span>
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
