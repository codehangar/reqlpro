var React = require('react');
var classNames = require('classnames');
var Favorite = require('../Favorite/Favorite');
var AddFavorite = require('../AddFavorite/AddFavorite');
var RethinkDbClient = window.rethinkDbClient;

var Favorites = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentDidMount: function() {
    this.setupEvents();
  },
  setupEvents: function() {
    var _this = this;
    RethinkDbClient.on('updateFavorites', function() {
      _this.setState({
        favorites: RethinkDbClient.favorites
      });
    });
  },
  render: function() {
    var favoriteNodes = this.state.favorites.map(function(favorite) {
      return (
        <Favorite key={favorite.name} favorite={favorite} />
      );
    });
    return (
      <div className="col-md-3 sidebar-content-col no-float">
        {favoriteNodes}
        <AddFavorite />
      </div>
    );
  }
});

module.exports = Favorites;