const React = require('react');
const Favorite = require('../Favorite/Favorite');
const AddFavorite = require('../AddFavorite/AddFavorite');

const Favorites = React.createClass({
  getInitialState: function() {
    return this.context.store;
  },
  componentDidMount: function() {
    this.setupEvents();
  },
  setupEvents: function() {
    this.state.on('updateRehinkDbClient', () => {
      this.forceUpdate();
    });
    this.state.on('updateFavorites', () => {
      this.forceUpdate();
    });
  },
  connectFavorite: function(favorite) {
    this.state.updateSelectedFavorite(favorite);
  },
  addFavorite: function() {
    this.state.showConnectionForm();
  },
  render: function() {
    const favoriteNodes = this.state.favorites.map((favorite) => {
      return (
        <Favorite
          key={favorite.index}
          favorite={favorite}
          selectedFavorite={this.state.selectedFavorite}
          connectFavorite={this.connectFavorite}
        />
      );
    });
    return (
      <div className="fav-content-col">
        {favoriteNodes}
        <AddFavorite addFavorite={this.addFavorite} />
      </div>
    );
  }
});
Favorites.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Favorites;
