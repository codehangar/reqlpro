var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var AddFavorite = React.createClass({
	getInitialState: function() {
    return {};
  },
  addFavorite: function(e) {
    e.preventDefault();
    RethinkDbClient.toggleConnectionForm();
  },
  render: function() {
    return (
      <div className="add-favorite">
        <i onClick={this.addFavorite} className="fa fa-plus add-favorites-icon"></i>
      </div>
    );
  }
});

module.exports = AddFavorite;