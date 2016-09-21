import React from 'react';
import Favorite from '../Favorite/Favorite';
import AddFavorite from '../AddFavorite/AddFavorite';
import {connect} from 'react-redux';
import {getConnection} from '../../core';


const Favorites = ({
  connections,
  selectedFavorite,
  onConnectionClick,
  onClickAddConnection
}) => {

  selectedFavorite = selectedFavorite || {};

  console.log("selectedFavorite", selectedFavorite)

  const favoriteNodes = connections.map((connection, i) => {
    return (
      <Favorite
        key={i}
        {...connection}
        active={selectedFavorite.index === connection.index}
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

};

function mapStateToProps (state) {
  console.log('Favorites state', state)
  console.log("state.connections", state.connections)
  return {
    connections: state.connections || [],
    // connections: state.connections ? state.connections : [],
    selectedFavorite: state.selectedFavorite || null
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickAddConnection: (favorite) => {
      dispatch({
        type: "SHOW_CONNECTION_FORM",
        mode: 'NEW'
      });
    },
    onConnectionClick: (connection) => {
      getConnection(dispatch, connection);
    }
  }
};

const FavoritesContainer = connect(mapStateToProps, mapDispatchToProps)(Favorites);

module.exports = FavoritesContainer;
