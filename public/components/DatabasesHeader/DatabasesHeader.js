const React = require('react');
const RethinkDbClient = window.rethinkDbClient;

const DatabasesHeader = React.createClass({
  editFavorite: function(e) {
    this.props.store.toggleConnectionForm(this.props.selectedFavorite);
  },
  render: function() {
    return (
      <div className="databases-header">
        <div>{this.props.selectedFavorite.name} <i onClick={this.editFavorite} className="fa fa-pencil edit-connection"></i></div>
      </div>
    );
  }
});

module.exports = DatabasesHeader;
