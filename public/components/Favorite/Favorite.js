var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var Favorite = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  connectFavorite: function() {
    RethinkDbClient.updateSelectedFavorite(this.state.favorite);
  },
  render: function() {
    return (
      <div className="favorite">
        <p onClick={this.connectFavorite}>{this.state.favorite.name}</p>
        <img src={'data:image/png;base64,' + this.state.favorite.identicon} />
      </div>
    );
  }
});

module.exports = Favorite;