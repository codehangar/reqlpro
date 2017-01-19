import { writeConfigFile } from '../../../actions';
import * as types from '../../../action-types';

export function deleteConnection(connection) {
  return dispatch => {
    dispatch({
      type: types.DELETE_CONNECTION,
      connection
    });
    dispatch(writeConfigFile());
  }
}
