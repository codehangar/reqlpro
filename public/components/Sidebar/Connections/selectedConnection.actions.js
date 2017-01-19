const RethinkDbService = require('../../../../main/services/rethinkdb.service');
import { getDbList } from '../../../actions';
import { actions } from 'react-redux-form';
import * as types from '../../../action-types';

export function showConnectionForm(connection = null) {
  return dispatch => {
    /**
     * Note: actions.change won't work with an undefined value,
     * which is why connection is initialized to null
     */
    dispatch(actions.change('forms.connection', connection));

    dispatch({
      type: types.SHOW_CONNECTION_FORM
    });
  }
}
export function selectConnection(connection) {
  return dispatch => {
    dispatch({
      type: types.SET_CONNECTION,
      connection
    });
    dispatch(getDbConnection(connection));
  }
}

export function getDbConnection(connection) {
  return dispatch => {
    RethinkDbService.getConnection(connection.host, connection.port, connection.authKey).then((conn) => {
      dispatch({
        type: 'SET_DB_CONNECTION',
        dbConnection: conn
      });
      dispatch(getDbList(conn));
    }).catch(error => {
      console.log('getDbConnection error', connection);
      dispatch({
        type: 'SET_DB_CONNECTION_ERROR',
        connectionError: {
          connection,
          error
        }
      });
    });
  }
}
