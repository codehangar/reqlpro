import React from 'react';
import { connect } from 'react-redux';
import Favorite from './Connection';
import AddFavorite from './AddConnection';
import { showConnectionForm, selectConnection } from './selectedConnection.actions';
import Segment from '../../../services/segment.service.js';

const Connections = ({
  connections,
  selectedConnection,
  onConnectionClick,
  onClickAddConnection
}) => {

  selectedConnection = selectedConnection || {};

  const connectionNodes = connections.map((connection, i) => {
    return (
      <Favorite
        key={i}
        {...connection}
        active={selectedConnection.index === connection.index}
        onConnectionClick={() => {
          onConnectionClick(connection)
        }}
      />
    );
  });

  return (
    <div className="fav-content-col">
      {connectionNodes}
      <AddFavorite addConnection={onClickAddConnection}/>
    </div>
  );

};

const mapStateToProps = (state) => {
  return {
    connections: state.connections || [],
    selectedConnection: state.connection.selected || null
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickAddConnection: () => {
      dispatch(showConnectionForm());
      Segment.track({
        event: 'connection.add'
      });
    },
    onConnectionClick: (connection) => {
      dispatch(selectConnection(connection));
      Segment.track({
        event: 'connection.click'
      });
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
