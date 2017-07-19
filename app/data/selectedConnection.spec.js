import jdenticon from 'jdenticon';
import md5 from 'md5';
import * as reducer from './selectedConnection.reducer';
import * as types from '../action-types';

let RethinkDbService;
let dispatch;
let DatabaseActions;
const FALSE_SUCCESS_ERROR = new Error('This promise should have failed');

describe('selectedConnection', () => {

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

      // Mock the rethinkdb service
      RethinkDbService = sinon.stub();
      mockery.registerMock('../services/rethinkdb.service', RethinkDbService);

      DatabaseActions = sinon.stub();
      DatabaseActions.getDbList = sinon.stub().returns(() => {});
      mockery.registerMock('./databases.actions', DatabaseActions);
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
              expect(RethinkDbService.getConnection.calledWith(connection)).to.equal(true);
              expect(dispatch.callCount).to.equal(4);

              expect(dispatch.calledWith({
                type: 'SET_CONNECTION_LOADING',
                loading: true
              })).to.equal(true);

              expect(dispatch.calledWith({
                type: 'SET_CONNECTION_LOADING',
                loading: false
              })).to.equal(true);

              expect(dispatch.calledWith({
                type: 'SET_DB_CONNECTION',
                dbConnection: 'im a connection'
              })).to.equal(true);

              const fourthDispatchCall = dispatch.getCall(3);
              expect(fourthDispatchCall.args[0]).to.be.a('function');
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
              expect(RethinkDbService.getConnection.calledWith(connection)).to.equal(true);
              expect(dispatch.callCount).to.equal(3);

              expect(dispatch.calledWith({
                type: 'SET_CONNECTION_LOADING',
                loading: true
              })).to.equal(true);

              expect(dispatch.calledWith({
                type: 'SET_CONNECTION_LOADING',
                loading: false
              })).to.equal(true);

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
