import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../public/reducer';

describe('reducer', () => {

  it('handles SET_STATE', () => {
    const initialState = Map();
    const action = {
      type: 'SET_STATE',
      state: {
        connection: {},
        userConfig: {
          email: 'cassie@codehangar.io',
          favorites: []
        }
      }
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.deep.equal({
      connection: {},
      userConfig: {
        email: 'cassie@codehangar.io',
        favorites: []
      }
    });
  });

});