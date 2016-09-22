import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';
import jdenticon from 'jdenticon';
import md5 from 'md5';

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
          connections: []
        }
      }
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.deep.equal({
      __altered: false,
      __hash: undefined,
      __ownerID: undefined,
      _root: undefined,
      size:0,
      connection: {},
      userConfig: {
        email: 'cassie@codehangar.io',
        connections: []
      }
    });
  });

  it('handles ADD_CONNECTION', () => {
    const initialState = {
      email: 'cassie@codehangar.io',
      connections: []
    }
    const action = {
      type: 'ADD_CONNECTION',
      connection: {
        authKey: "",
        database: "",
        host: "192.168.99.100",
        identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
        index: 0,
        name: "rethink-tut",
        port: "32769"
      }
    }
    const nextState = reducer(initialState, action);

    expect(nextState).to.deep.equal({
      email: 'cassie@codehangar.io',
      connections: [
        {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769"
        }
      ],
      selectedConnection: {
        authKey: "",
        database: "",
        host: "192.168.99.100",
        identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
        index: 0,
        name: "rethink-tut",
        port: "32769"
      }
    });
  });

  it('handles HIDE_CONNECTION_FORM', () => {
    const initialState = {
      email: 'cassie@codehangar.io',
      showAddConnectionForm: []
    }
    const action = {
      type: "HIDE_CONNECTION_FORM"
    }
    const nextState = reducer(initialState, action);
    expect(nextState).to.deep.equal({
      email: 'cassie@codehangar.io'
    });
  });

});