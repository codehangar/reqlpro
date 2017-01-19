import * as types from './action-types';

const initialState = {

};

export function connection(state = initialState, action) {
  switch (action.type) {
    case types.SET_CONNECTION:
      console.log('connection reducer !!!');
      return action.connection
      // return setConnection(state, action.connection);
    case types.FETCH_PEOPLE:
      return {
        loading: true,
        data: null
      };
    default:
      return state;
  }
}
