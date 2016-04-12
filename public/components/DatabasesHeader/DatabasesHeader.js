var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var DatabasesHeader = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  editFavorite: function(e) {
    e.preventDefault();
    RethinkDbClient.toggleConnectionForm(this.state.selectedFavorite);
  },
  render: function() {
    return (
      <div className="databases-header">
        <p>{this.state.selectedFavorite.name}</p>
        <i onClick={this.editFavorite} className="fa fa-pencil"></i>
      </div>
    );
  }
});

module.exports = DatabasesHeader;