import jdenticon from 'jdenticon';
import md5 from 'md5';
import * as reducer from './selectedConnection.reducer';
import * as types from '../../../action-types';

let RethinkDbService;
let dispatch;
const FALSE_SUCCESS_ERROR = new Error('This promise should have failed');

describe('selectedConnection', () => {
  describe('Actions', () => {

    beforeEach(function() {

      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      });

      dispatch = sinon.stub();

      // Mock the rethinkdb service
      RethinkDbService = sinon.stub();
      mockery.registerMock('../../../../main/services/rethinkdb.service', RethinkDbService);
      mockery.registerMock('../main/services/rethinkdb.service', RethinkDbService);
    });

    describe('getDbConnection', () => {

      const state = {
        email: 'cassie@codehangar.io',
        connections: [{
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769"
        }]
      };
      const connection = state.connections[0];

      describe('success', () => {

        beforeEach(function() {
          RethinkDbService.getConnection = sinon.stub().returns(new Promise(function(resolve, reject) {
            resolve('im a connection');
          }));
        });

        it('returns successful connection info from RethinkDB', (done) => {
          const { getDbConnection } = require('./selectedConnection.actions');
          const promise = getDbConnection(connection)(dispatch);

          promise
            .then(function() {
              expect(RethinkDbService.getConnection.callCount).to.equal(1);
              expect(RethinkDbService.getConnection.calledWith('192.168.99.100', '32769', '')).to.equal(true);
              expect(dispatch.callCount).to.equal(2);
              expect(dispatch.calledWith({
                type: 'SET_DB_CONNECTION',
                dbConnection: 'im a connection'
              })).to.equal(true);
              const secondDispatchCall = dispatch.getCall(1);
              expect(secondDispatchCall.args[0]).to.be.a('function');
              done();
            })
            .catch(done);
        });

      });

      describe('failure', () => {

        beforeEach(function() {
          RethinkDbService.getConnection = sinon.stub().returns(new Promise(function(resolve, reject) {
            reject('im a connection error');
          }));
        });

        it('handles failed connection info from RethinkDB', (done) => {
          const { getDbConnection } = require('./selectedConnection.actions');
          const promise = getDbConnection(connection)(dispatch);

          promise
            .then(function() {
              done(FALSE_SUCCESS_ERROR);
            })
            .catch(function(err) {
              expect(RethinkDbService.getConnection.callCount).to.equal(1);
              expect(RethinkDbService.getConnection.calledWith('192.168.99.100', '32769', '')).to.equal(true);
              expect(dispatch.callCount).to.equal(1);
              expect(dispatch.calledWith({
                type: 'SET_DB_CONNECTION_ERROR',
                connectionError: {
                  error: 'im a connection error',
                  connection
                }
              })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });
    });
  });

  describe('Reducer', () => {

    describe('SET_CONNECTION', () => {
      it('sets a new selectedConnection', () => {
        const state = {};
        const action = {
          type: types.SET_CONNECTION,
          connection: {
            authKey: "",
            database: "",
            host: "192.168.99.100",
            identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
            index: 0,
            name: "rethink-tut",
            port: "32769"
          }
        };
        const nextState = reducer.connection(state, action);

        expect(nextState).to.deep.equal({
          selected: {
            authKey: "",
            database: "",
            host: "192.168.99.100",
            identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
            index: 0,
            name: "rethink-tut",
            port: "32769"
          }
        })
      });
    });

    describe('SHOW_CONNECTION_FORM', () => {
      it('shows the connection form', () => {
        const state = {};
        const action = { type: types.SHOW_CONNECTION_FORM };
        const nextState = reducer.connection(state, action);
        expect(nextState).to.deep.equal({ showForm: true });
      });
    });

    describe('hideConnectionForm', () => {
      it('HIDE_CONNECTION_FORM hides the connection form', () => {
        const state = { showForm: true };
        const action = { type: types.HIDE_CONNECTION_FORM };
        const nextState = reducer.connection(state, action);
        expect(nextState).to.deep.equal({ showForm: false });
      });
      it('ADD_CONNECTION hides the connection form', () => {
        const state = { showForm: true };
        const action = { type: types.ADD_CONNECTION };
        const nextState = reducer.connection(state, action);
        expect(nextState).to.deep.equal({ showForm: false });
      });
      it('UPDATE_CONNECTION hides the connection form', () => {
        const state = { showForm: true };
        const action = { type: types.UPDATE_CONNECTION };
        const nextState = reducer.connection(state, action);
        expect(nextState).to.deep.equal({ showForm: false });
      });
      it('DELETE_CONNECTION hides the connection form', () => {
        const state = { showForm: true };
        const action = { type: types.DELETE_CONNECTION };
        const nextState = reducer.connection(state, action);
        expect(nextState).to.deep.equal({ showForm: false });
      });
    });
  });
});
