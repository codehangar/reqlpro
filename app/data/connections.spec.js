import freeze from 'deep-freeze-node';
import jdenticon from 'jdenticon';
import md5 from 'md5';
import * as reducer from './connections.reducer';
import * as types from '../action-types';

let RethinkDbService;
let KeychainService;
let dispatch;
let getState;

describe('connections', () => {

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
  });

  describe('Actions', () => {

    beforeEach(function() {

      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      });

      dispatch = sinon.stub();
      getState = sinon.stub().returns({
        connections: [],
        connection: {
          selected: {}
        }
      });

      // Mock the rethinkdb service
      RethinkDbService = sinon.stub();
      mockery.registerMock('../services/rethinkdb.service', RethinkDbService);
      mockery.registerMock('../services/rethinkdb.service', RethinkDbService);

      // Mock related actions
      const actions = sinon.stub();
      actions.writeConfigFile = sinon.stub().returns('testingWriteConfigFileCall');
      mockery.registerMock('../actions', actions);

      const KeychainService = sinon.stub();
      mockery.registerMock('../services/keychain.service', KeychainService);
    });

    describe('deleteConnection', () => {
      it('deletes connection and writes to config file', () => {
        const { deleteConnection } = require('./connections.actions');
        const connection = {
          name: 'hello'
        };

        deleteConnection(connection)(dispatch, getState);

        expect(dispatch.callCount).to.equal(3);
        expect(dispatch.calledWith({
          type: types.DELETE_CONNECTION,
          connection
        })).to.equal(true);
        expect(dispatch.calledWith('testingWriteConfigFileCall')).to.equal(true);
      });
    });

  });

  describe('Reducer', () => {

    describe('SET_CONNECTIONS', () => {
      it('adds full connections list', () => {
        const state = {};
        const action = {
          type: types.SET_CONNECTIONS,
          connections: ['connection1', 'connection2']
        };
        let nextState = reducer.connections(freeze(state), action);
        expect(nextState).to.deep.equal(
          ['connection1', 'connection2']
        );
      });
    });

    describe('ADD_CONNECTION', () => {
      it('adds a new connection', () => {
        const state = [];
        const action = {
          type: types.ADD_CONNECTION,
          connection: {
            name: "rethink-tut",
            host: "192.168.99.100",
            port: "32769"
          }
        };
        const nextState = reducer.connections(freeze(state), action);
        expect(nextState).to.deep.equal([{
          name: "rethink-tut",
          host: "192.168.99.100",
          port: "32769",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0
        }])
      });
    });

    describe('UPDATE_CONNECTION', () => {
      it('updates modified connection info', () => {
        const state = [{
          name: "rethink-tut",
          host: "192.168.99.100",
          port: "32769",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0
        }, {
          name: "apple",
          host: "192.168.99.100",
          port: "32769",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1
        }];

        const action = {
          type: types.UPDATE_CONNECTION,
          connection: {
            name: "banana",
            port: "32769",
            host: "192.168.99.100",
            identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
            index: 1
          }
        };

        const nextState = reducer.connections(freeze(state), action);

        expect(nextState).to.deep.equal([{
          name: "rethink-tut",
          host: "192.168.99.100",
          port: "32769",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0
        }, {
          name: "banana",
          port: "32769",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1
        }]);
      });
    });

    describe('DELETE_CONNECTION', () => {
      it('removes connection', () => {
        const state = [{
          name: "rethink-tut",
          host: "192.168.99.100",
          port: "32769",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0
        }, {
          name: "apple",
          host: "192.168.99.100",
          port: "32769",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1
        }];

        const action = {
          type: types.DELETE_CONNECTION,
          connection: state[0]
        };

        const nextState = reducer.connections(freeze(state), action);

        expect(nextState).to.deep.equal([{
          name: "apple",
          host: "192.168.99.100",
          port: "32769",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0
        }]);

      });

      it('deletes the selectedConnection if no other connections exist', () => {
        const state = [{
          name: "apple",
          host: "192.168.99.100",
          port: "32769",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0
        }];
        const action = {
          type: types.DELETE_CONNECTION,
          connection: state[0]
        };

        const nextState = reducer.connections(freeze(state), action);

        expect(nextState).to.deep.equal([]);
      });

    })
  });
});
