import { actions } from 'react-redux-form';
const RethinkDbService = require('../services/rethinkdb.service');
import { getDbList } from './databases.actions';
import * as types from '../action-types';

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
    dispatch({
      type: 'REMOVE_SELECTED_TABLE'
    });
    dispatch(getDbConnection(connection));
  }
}

// receive connection
export function getDbConnection(connection) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'SET_CONNECTION_LOADING',
        loading: true
      });

      RethinkDbService.getConnection(connection)
        .then((conn) => {
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
        })
        .catch(error => {
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
