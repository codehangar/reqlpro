const React = require('react');
const Favorite = require('../Favorite/Favorite');
const AddFavorite = require('../AddFavorite/AddFavorite');
import {connect} from 'react-redux';
var getConnection = require('../../core').getConnection;

const Favorites = ({}) => ({
  render: function() {
    const {connections, onConnectionClick, onClickAddConnection} = this.props;
    console.log('Connections', connections, this.props)
    const favoriteNodes = connections.map((connection, i) => {
      return (
        <Favorite
          key={i}
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
      getConnection(dispatch, connection);
    }
  }
};
const FavoritesContainer = connect(mapStateToProps, mapDispatchToProps)(Favorites);

module.exports = FavoritesContainer;
