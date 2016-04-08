var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var Favorite = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  connectFavorite: function() {
    RethinkDbClient.updateSelectedFavorite(this.state.favorite);
  },
  render: function() {
    return (
      <div className="favorite">
        <img className="favorite-identicon" src={'data:image/png;base64,' + this.state.favorite.identicon} />
        <p className="text-center" onClick={this.connectFavorite}>{this.state.favorite.name}</p>
      </div>
    );
  }
});

module.exports = Favorite;