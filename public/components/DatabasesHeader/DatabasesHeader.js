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
        <div>{this.state.selectedFavorite.name} <i onClick={this.editFavorite} className="fa fa-pencil edit-connection"></i></div>
        
      </div>
    );
  }
});

module.exports = DatabasesHeader;