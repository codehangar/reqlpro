const React = require('react');
const Favorite = require('../Favorite/Favorite');
const AddFavorite = require('../AddFavorite/AddFavorite');
import {connect} from 'react-redux';

const Favorites = ({}) => ({
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
    const {connections, onConnectionClick, onClickAddConnection} = this.props
    console.log('Connections', connections, this.props)
    let key = 1
    const favoriteNodes = connections.map((connection) => {
      return (
        <Favorite
          key={key++}
          {...connection}
          // active={selectedFavorite.index === connection.index}
          onClick={() => {onConnectionClick(connection)}}
        />
      );
    });
    return (
      <div className="fav-content-col">
        {favoriteNodes}
        <AddFavorite addFavorite={() => onClickAddConnection()} />
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
  console.log('Favorites', state, state.connections)
  return {
    connections: state.connections?state.connections:[],
    selectedFavorite: state.selectedFavorite || null
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    onClickAddConnection: (favorite) =>{
      dispatch({
        type: "SHOW_CONNECTION_FORM",
        mode: 'NEW'
      })
    },
    onConnectionClick: (connection) =>{
      dispatch({
        type: "SET_FAVORITE_CONNECTION",
        connection
      })
    }
  }
};
const FavoritesContainer = connect(mapStateToProps, mapDispatchToProps)(Favorites);

module.exports = FavoritesContainer;
