const RethinkDbService = require('../../../../main/services/rethinkdb.service');
import { getDbList } from '../Databases/databases.actions';
import { actions } from 'react-redux-form';
import * as types from '../../../action-types';

export function showConnectionForm(connection = {}) {
  return dispatch => {
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
    dispatch({
      type: 'SET_DB_CONNECTION_ERROR',
      connectionError: null
    });
    dispatch(getDbConnection(connection));
  }
}

export function getDbConnection(connection) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'SET_CONNECTION_LOADING',
        loading: true
      });

      RethinkDbService.getConnection(connection.host, connection.port, connection.authKey).then((conn) => {
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        dispatch({
          type: 'SET_DB_CONNECTION',
          dbConnection: conn
        });
        dispatch(getDbList(conn));
        resolve(conn);
      }).catch(error => {
        dispatch({
          type: 'SET_CONNECTION_LOADING',
          loading: false
        });
        dispatch({
          type: 'SET_DB_CONNECTION_ERROR',
          connectionError: {
            connection,
            error
          }
        });
        reject(error);
      });
    });
  }
}
