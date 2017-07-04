import { writeConfigFile } from '../../../actions';
import { updateKeysForConnection } from '../../../services/keychain.service';
import * as types from '../../../action-types';
import { selectConnection } from './selectedConnection.actions';

export function addConnection(connection) {
  return (dispatch, getState) => {
    dispatch({
      type: types.ADD_CONNECTION,
      connection: connection
    });
    dispatch(writeConfigFile());

    // Add password and cert to system keychain
    updateKeysForConnection(connection);

    // Grab the connection from the updated array of connections, which will have the index property
    const conns = getState().connections;
    dispatch(selectConnection(conns[conns.length - 1]));
  }
}

export function updateConnection(connection) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_CONNECTION,
      connection: connection
    });
    dispatch(writeConfigFile());

    // Add password and cert to system keychain
    updateKeysForConnection(connection);

    dispatch(selectConnection(connection));
  }
}

export function deleteConnection(connection) {
  return (dispatch, getState) => {
    // Check if this is the currently selected connection
    const shouldSelectNew = getState().connection.selected.index === connection.index;

    dispatch({
      type: types.DELETE_CONNECTION,
      connection
    });
    dispatch(writeConfigFile());

    if (shouldSelectNew && getState().connections[0]) {
      // Grab the updated array of connections, and select the first one
      dispatch(selectConnection(getState().connections[0]));
    } else {
      //if there are no connections to select, clear connection error
      dispatch({
        type: 'SET_DB_CONNECTION_ERROR',
        connectionError: null
      });
    }
  }
}
