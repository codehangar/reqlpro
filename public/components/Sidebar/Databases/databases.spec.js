import freeze from 'deep-freeze-node';
import * as reducer from './databases.reducer';
import * as types from '../../../action-types';

let dispatch;
let RethinkDbService;
const FALSE_SUCCESS_ERROR = new Error('This promise should have failed');

describe('databases', () => {

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

      // replace the require() module `rethinkdb` with a stub object
      mockery.registerMock('../../../../main/services/rethinkdb.service', RethinkDbService);

      // replace the require() module `ReQLEval` with a stub object
      const ReQLEval = sinon.stub();
      mockery.registerMock('../main/services/reql-eval.service', ReQLEval);
    });


    describe('getDbList', () => {

      const state = {
        dbConnection: { stuff: 'stuff' }
      };
      const databases = ['dbName1', 'dbName2'];

      describe('success', () => {
        beforeEach(function() {
          RethinkDbService.getDbList = sinon.stub().returns(new Promise(function(resolve, reject) {
            resolve(databases);
          }));
        });

        it('get list of databases from dbConnection', (done) => {
          const { getDbList } = require('./databases.actions');
          const promise = getDbList(state.dbConnection)(dispatch);
          promise
            .then(function() {
              expect(RethinkDbService.getDbList.callCount).to.equal(1);
              expect(RethinkDbService.getDbList.calledWith(state.dbConnection)).to.equal(true);
              expect(dispatch.callCount).to.equal(1);
              // const dCall = dispatch.getCall(0);
              // console.log('dCall.args[0].databases', dCall.args[0].databases);
              expect(dispatch.calledWith({
                type: 'SET_DB_LIST',
                databases: [
                  { name: 'dbName1' },
                  { name: 'dbName2' }
                ]
              })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });

      describe('failure', () => {

        beforeEach(function() {
          RethinkDbService.getDbList = sinon.stub().returns(new Promise(function(resolve, reject) {
            reject('im a dbList fetching error');
          }));
        });

        it('handles failed connection info from RethinkDB', (done) => {
          const { getDbList } = require('./databases.actions');
          const promise = getDbList(state.dbConnection)(dispatch);
          promise
            .then(function() {
              done(FALSE_SUCCESS_ERROR);
            })
            .catch(function(er) {
              expect(RethinkDbService.getDbList.callCount).to.equal(1);
              expect(RethinkDbService.getDbList.calledWith(state.dbConnection)).to.equal(true);
              // expect(dispatch.callCount).to.equal(1);
              // const dCall = dispatch.getCall(0);
              // console.log('dCall.args[0]', dCall.args[0]);
              // expect(dispatch.calledWith({
              //   type: 'SET_DB_LIST',
              //   databases: 'im a dbList fetching error'
              // })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });
    });

    describe('createDatabase', () => {

      const dbConnection = { stuff: 'stuff' };
      const dbName = 'dbName1';

      describe('success', () => {
        beforeEach(function() {
          RethinkDbService.createDb = sinon.stub().returns(new Promise(function(resolve, reject) {
            resolve('ok was successfully created.');
          }));
        });

        it('should add a new database to the list of databases', (done) => {
          const { createDatabase } = require('./databases.actions');
          const promise = createDatabase(dbConnection, dbName)(dispatch);
          promise
            .then(function() {
              expect(RethinkDbService.createDb.callCount).to.equal(1);
              // const dCall = RethinkDbService.createDb.getCall(0);
              // console.log('dCall.args', dCall.args);
              expect(RethinkDbService.createDb.calledWith(dbConnection, dbName)).to.equal(true);
              expect(dispatch.callCount).to.equal(2);
              expect(dispatch.calledWith({
                type: 'ADD_TO_DB_LIST',
                database: {
                  name: dbName
                }
              })).to.equal(true);
              expect(dispatch.calledWith({ type: types.TOGGLE_DATABASE_FORM })).to.equal(true);

              done();
            })
            .catch(done);
        });

      });

      describe('failure', () => {

        beforeEach(function() {
          RethinkDbService.createDb = sinon.stub().returns(new Promise(function(resolve, reject) {
            reject('im a db create error');
          }));
        });

        it('handles failed create database info from RethinkDB', (done) => {
          const { createDatabase } = require('./databases.actions');
          const promise = createDatabase(dbConnection, dbName)(dispatch);
          promise
            .then(function() {
              done(FALSE_SUCCESS_ERROR);
            })
            .catch(function(er) {
              expect(RethinkDbService.createDb.callCount).to.equal(1);
              // const dCall = RethinkDbService.createDb.getCall(0);
              // console.log('dCall.args', dCall.args);
              expect(RethinkDbService.createDb.calledWith(dbConnection, dbName)).to.equal(true);
              // expect(dispatch.callCount).to.equal(1);
              // expect(dispatch.calledWith({
              //   type: 'ADD_TO_DB_LIST',
              //   database: 'im a db create error'
              // })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });
    });
  });

  describe('Reducer', () => {

    describe('SET_DB_LIST', () => {
      it('should set databases array', () => {
        const state = [];
        const action = {
          type: types.SET_DB_LIST,
          databases: [{
            name: 'Test'
          }, {
            name: 'Test2'
          }]
        };
        const nextState = reducer.databases(freeze(state), action);
        expect(nextState).to.deep.equal([{
          name: 'Test'
        }, {
          name: 'Test2'
        }]);
      });
    });

    describe('ADD_TO_DB_LIST', () => {
      it('should add database object to databases array', () => {
        const state = [{
          name: 'Test'
        }, {
          name: 'Test2'
        }];
        const action = {
          type: types.ADD_TO_DB_LIST,
          database: {
            name: 'new',
          }
        };
        const nextState = reducer.databases(freeze(state), action);
        expect(nextState).to.deep.equal([{
          name: 'Test'
        }, {
          name: 'Test2'
        }, {
          name: 'new',
        }]);
      });
    });

    describe('DELETE_DATABASE', () => {
      it('removes database from databases array', () => {
        let state = [{
          name: 'Test'
        }, {
          name: 'Test2'
        }, {
          name: 'new',
        }];
        const action = {
          type: types.DELETE_DATABASE,
          dbName: "Test2"
        };

        const nextState = reducer.databases(freeze(state), action);
        expect(nextState).to.deep.equal([{
          name: 'Test'
        }, {
          name: 'new'
        }]);
      });
    });

    describe('TOGGLE_TABLE_VISIBILITY', () => {
      it('should set the visibility of tables of the appropriate database object to true', () => {
        const state = [{
          name: 'myDatabaseName1'
        }, {
          name: 'myDatabaseName2'
        }, {
          name: 'myDatabaseName3'
        }];
        const action = {
          type: types.TOGGLE_TABLE_VISIBILITY,
          dbName: 'myDatabaseName2',
          showTables: true
        };
        const nextState = reducer.databases(freeze(state), action);

        expect(nextState).to.deep.equal([{
          name: 'myDatabaseName1'
        }, {
          name: 'myDatabaseName2',
          showTables: true
        }, {
          name: 'myDatabaseName3'
        }]);
      });

      it('should set the visibility of tables of the appropriate database object to false', () => {
        const state = [{
          name: 'myDatabaseName1'
        }, {
          name: 'myDatabaseName2'
        }, {
          name: 'myDatabaseName3',
          showTables: true
        }];
        const action = {
          type: types.TOGGLE_TABLE_VISIBILITY,
          dbName: 'myDatabaseName3',
          showTables: false
        };
        const nextState = reducer.databases(freeze(state), action);
        expect(nextState).to.deep.equal([{
          name: 'myDatabaseName1'
        }, {
          name: 'myDatabaseName2'
        }, {
          name: 'myDatabaseName3',
          showTables: false
        }]);
      });
    });
  });
});
