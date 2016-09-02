const React = require('react');
const Favorite = require('../Favorite/Favorite');
const AddFavorite = require('../AddFavorite/AddFavorite');
import {connect} from 'react-redux';

const Favorites = ({
  favorites,
  selectedFavorite,
  onFavoriteClick
}) => ({
  // getInitialState: function() {
  //   return this.context.store;
  // },
  // componentDidMount: function() {
  //   this.setupEvents();
  // },
  // setupEvents: function() {
  //   this.state.on('updateRehinkDbClient', () => {
  //     this.forceUpdate();
  //   });
  //   this.state.on('updateFavorites', () => {
  //     this.forceUpdate();
  //   });
  // },
  // connectFavorite: function(favorite) {
  //   this.state.updateSelectedFavorite(favorite);
  // },
  // addFavorite: function() {
  //   this.state.showConnectionForm();
  // },
  render: function() {
    const favoriteNodes = favorites.map((favorite) => {
      return (
        <Favorite
          key={favorite.index}
          {...favorite}
          // active={selectedFavorite.index === favorite.index}
          onClick={() => {onFavoriteClick(favorite)}}
        />
      );
    });
    return (
      <div className="fav-content-col">
        {favoriteNodes}
        <AddFavorite addFavorite={this.addFavorite} />
      </div>
    );
    return (
      <div className="fav-content-col"></div>
    );
  }
});
// Favorites.contextTypes = {
//   store: React.PropTypes.object
// };

function mapStateToProps(state) {
  // console.log('Favorites', state)
  return {
    favorites: state.favorites,
    selectedFavorite: state.selectedFavorite || null
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    onFavoriteClick: (favorite) =>{
      dispatch({
        type: "SET_FAVORITE",
        favorite
      })
    }
  }
};
const FavoritesContainer = connect(mapStateToProps, mapDispatchToProps)(Favorites);

module.exports = FavoritesContainer;
