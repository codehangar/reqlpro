import freeze from 'deep-freeze-node';
import * as reducer from './tables.reducer';
import * as types from '../action-types';

let dispatch;
let RethinkDbService;

describe('tables', () => {

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
      mockery.registerMock('../services/rethinkdb.service', RethinkDbService);

      // replace the require() module `ReQLEval` with a stub object
      const Actions = sinon.stub();
      Actions.queryTable = sinon.stub();
      mockery.registerMock('../actions', Actions);
    });

    describe('getDbTables', () => {

      const dbConnection = { stuff: 'stuff' };
      const dbName = 'dbName1';

      describe('success', () => {
        beforeEach(function() {
          RethinkDbService.getTableList = sinon.stub().returns(new Promise(function(resolve, reject) {
            resolve(['table1', 'table2']);
          }));
        });

        it('should get a list of tables from a database', (done) => {
          const { getDbTables } = require('./tables.actions');
          const promise = getDbTables(dbConnection, dbName)(dispatch);
          promise
            .then(function() {
              expect(RethinkDbService.getTableList.callCount).to.equal(1);
              expect(RethinkDbService.getTableList.calledWith(dbConnection, dbName)).to.equal(true);
              expect(dispatch.callCount).to.equal(1);
              expect(dispatch.calledWith({
                type: 'SET_DB_TABLES',
                dbName: dbName,
                tables: ['table1', 'table2']
              })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });

      describe('failure', () => {

        beforeEach(function() {
          RethinkDbService.getTableList = sinon.stub().returns(new Promise(function(resolve, reject) {
            reject('im a db tables fetching error');
          }));
        });

        it('handles failed connection info from RethinkDB', (done) => {
          const { getDbTables } = require('./tables.actions');
          const promise = getDbTables(dbConnection, dbName)(dispatch);
          promise
            .then(function() {
              done(FALSE_SUCCESS_ERROR);
            })
            .catch(function(er) {
              expect(RethinkDbService.getTableList.callCount).to.equal(1);
              expect(RethinkDbService.getTableList.calledWith(dbConnection, dbName)).to.equal(true);
              // expect(dispatch.callCount).to.equal(1);
              // const dCall = dispatch.getCall(0);
              // console.log('dCall.args[0]', dCall.args[0]);
              // expect(dispatch.calledWith({
              //   type: 'SET_DB_TABLES',
              //   tables: 'im a db tables fetching error'
              // })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });
    });


    describe('createTable', () => {

      const dbConnection = { stuff: 'stuff' };
      const dbName = 'dbName1';
      const tableName = 'table1';

      describe('success', () => {
        beforeEach(function() {
          RethinkDbService.createTable = sinon.stub().returns(new Promise(function(resolve, reject) {
            resolve('ok was successfully created.');
          }));
        });

        it('should get a list of tables from a database', (done) => {
          const { createTable } = require('./tables.actions');
          const promise = createTable(dbConnection, dbName, tableName)(dispatch);
          promise
            .then(function() {
              expect(RethinkDbService.createTable.callCount).to.equal(1);
              expect(RethinkDbService.createTable.calledWith(dbConnection, dbName, tableName)).to.equal(true);
              expect(dispatch.callCount).to.equal(2);
              expect(dispatch.calledWith({
                type: 'ADD_TO_TABLE_LIST',
                dbName,
                tableName
              })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });

      describe('failure', () => {

        beforeEach(function() {
          RethinkDbService.createTable = sinon.stub().returns(new Promise(function(resolve, reject) {
            reject('im a create table error');
          }));
        });

        it('handles failed creation info from RethinkDB', (done) => {
          const { createTable } = require('./tables.actions');
          const promise = createTable(dbConnection, dbName, tableName)(dispatch);
          promise
            .then(function() {
              done(FALSE_SUCCESS_ERROR);
            })
            .catch(function(er) {
              expect(RethinkDbService.createTable.callCount).to.equal(1);
              expect(RethinkDbService.createTable.calledWith(dbConnection, dbName, tableName)).to.equal(true);
              // expect(dispatch.callCount).to.equal(1);
              // expect(dispatch.calledWith({
              //   type: 'ADD_TO_TABLE_LIST',
              //   table: 'im a create table error'
              // })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });
    });

    describe('deleteTable', () => {

      const dbConnection = { stuff: 'stuff' };
      const dbName = 'dbName1'
      const tableName = 'table1';

      describe('success', () => {
        beforeEach(function() {
          RethinkDbService.deleteTable = sinon.stub().returns(new Promise(function(resolve, reject) {
            resolve('ok was successfully created.');
          }));
        });

        it('should delete a table', (done) => {
          const { deleteTable } = require('./tables.actions');
          const promise = deleteTable(dbConnection, dbName, 'table1')(dispatch);
          promise
            .then(function() {
              expect(RethinkDbService.deleteTable.callCount).to.equal(1);
              expect(RethinkDbService.deleteTable.calledWith(dbConnection, dbName, 'table1')).to.equal(true);
              // expect(dispatch.callCount).to.equal(1);
              expect(dispatch.calledWith({
                type: 'DELETE_TABLE',
                dbName: dbName,
                tableName: 'table1'
              })).to.equal(true);
              done();
            })
            .catch(done);
        });

      });

      describe('failure', () => {

        beforeEach(function() {
          RethinkDbService.deleteTable = sinon.stub().returns(new Promise(function(resolve, reject) {
            reject('im a delete table error');
          }));
        });

        it('handles failed delete info from RethinkDB', (done) => {
          const { deleteTable } = require('./tables.actions');
          const promise = deleteTable(dbConnection, dbName, 'table1')(dispatch);
          promise
            .then(function() {
              done(FALSE_SUCCESS_ERROR);
            })
            .catch(function(er) {
              expect(RethinkDbService.deleteTable.callCount).to.equal(1);
              expect(RethinkDbService.deleteTable.calledWith(dbConnection, dbName, 'table1')).to.equal(true);
              done();
            })
            .catch(done);
        });

      });
    });


  });


  describe('Reducer', () => {
    describe('SET_DB_TABLES', () => {
      it('should add tables array to appropriate database object', () => {
        const state = {};
        const action = {
          type: types.SET_DB_TABLES,
          dbName: 'myDb',
          tables: ['Table1', 'Table2']
        };

        let nextState = reducer.tables(freeze(state), action);
        expect(nextState).to.deep.equal({
          myDb: ['Table1', 'Table2']
        });
      });

      it('should not die when there are no tables in dat base', () => {
        const state = {
          myDb: ['Table1', 'Table2']
        };
        const action = {
          type: types.SET_DB_TABLES,
          dbName: 'newDb',
          tables: []
        };
        let nextState = reducer.tables(freeze(state), action);
        expect(nextState).to.deep.equal({
          myDb: ['Table1', 'Table2'],
          newDb: []
        });
      });
    });

    describe('ADD_TO_TABLE_LIST', () => {
      it('add table name to tables array of the appropriate database object', () => {
        const state = {
          myDb: ['Table1', 'Table2']
        };
        const action = {
          type: types.ADD_TO_TABLE_LIST,
          dbName: 'myDb',
          tableName: 'newTable'
        };
        let nextState = reducer.tables(freeze(state), action);
        expect(nextState).to.deep.equal({
          myDb: ['Table1', 'Table2', 'newTable']
        });
      });
    });


    describe('deleteTable', () => {
      it('removes table from selectedConnection', () => {
        const state = {
          myDb: ['Table1', 'Table2', 'newTable']
        };
        const action = {
          type: types.DELETE_TABLE,
          dbName: 'myDb',
          tableName: 'Table2'
        };
        const nextState = reducer.tables(freeze(state), action);
        expect(nextState).to.deep.equal({
          myDb: ['Table1', 'newTable']
        });
      });
    });
  });
});

