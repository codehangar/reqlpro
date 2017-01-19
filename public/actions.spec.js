import jdenticon from 'jdenticon';
import md5 from 'md5';

// Can't use import syntax when we need to mock
// import {
// getDbConnection,
// } from '../public/actions';

let RethinkDbService, configService;
let dispatch;
const FALSE_SUCCESS_ERROR = new Error('This promise should have failed');


describe('Action Creators', () => {

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
    mockery.registerMock('../main/services/rethinkdb.service', RethinkDbService);

    // replace the require() module `ReQLEval` with a stub object
    const ReQLEval = sinon.stub();
    mockery.registerMock('../main/services/reql-eval.service', ReQLEval);

    // replace the require() module `configService` with a stub object
    configService = sinon.stub();
    mockery.registerMock('./main/services/config.service', configService);

  });

  describe('getDbList', () => {

    const state = {
      email: 'cassie@codehangar.io',
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
        const { getDbList } = require('./actions');
        const promise = getDbList(state.dbConnection)(dispatch);
        promise
          .then(function() {
            expect(RethinkDbService.getDbList.callCount).to.equal(1);
            expect(RethinkDbService.getDbList.calledWith(state.dbConnection)).to.equal(true);
            expect(dispatch.callCount).to.equal(1);
            const dCall = dispatch.getCall(0);
            console.log('dCall.args[0].databases', dCall.args[0].databases);
            expect(dispatch.calledWith({
              type: 'SET_DB_LIST',
              databases: [
                { name: 'dbName1', tables: [] },
                { name: 'dbName2', tables: [] }
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
        const { getDbList } = require('./actions');
        const promise = getDbList(state.dbConnection)(dispatch);
        console.log('promise', promise);
        promise
          .then(function() {
            console.log('yes', yes);
            done(FALSE_SUCCESS_ERROR);
          })
          .catch(function(er) {
            console.log('er', er);
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

  describe('getDbTables', () => {

    const dbConnection = { stuff: 'stuff' };
    const database = { name: 'dbName1', tables: [] };

    describe('success', () => {
      beforeEach(function() {
        RethinkDbService.getTableList = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve(['table1', 'table2']);
        }));
      });

      it('should get a list of tables from a database', (done) => {
        const { getDbTables } = require('./actions');
        const promise = getDbTables(dbConnection, database)(dispatch);
        promise
          .then(function() {
            expect(RethinkDbService.getTableList.callCount).to.equal(1);
            expect(RethinkDbService.getTableList.calledWith(dbConnection, database.name)).to.equal(true);
            expect(dispatch.callCount).to.equal(1);
            expect(dispatch.calledWith({
              type: 'SET_DB_TABLES',
              database,
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
        const { getDbTables } = require('./actions');
        const promise = getDbTables(dbConnection, database)(dispatch);
        promise
          .then(function() {
            done(FALSE_SUCCESS_ERROR);
          })
          .catch(function(er) {
            expect(RethinkDbService.getTableList.callCount).to.equal(1);
            expect(RethinkDbService.getTableList.calledWith(dbConnection, database.name)).to.equal(true);
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

  describe('createDatabase', () => {

    const dbConnection = { stuff: 'stuff' };
    const database = { name: 'dbName1', tables: [] };

    describe('success', () => {
      beforeEach(function() {
        RethinkDbService.createDb = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve('ok was successfully created.');
        }));
      });

      it('should get a list of tables from a database', (done) => {
        const { createDatabase } = require('./actions');
        const promise = createDatabase(dbConnection, database)(dispatch);
        promise
          .then(function() {
            expect(RethinkDbService.createDb.callCount).to.equal(1);
            expect(RethinkDbService.createDb.calledWith(dbConnection, database.name)).to.equal(true);
            expect(dispatch.callCount).to.equal(1);
            expect(dispatch.calledWith({
              type: 'ADD_TO_DB_LIST',
              database: {
                name: database.name,
                tables: []
              }
            })).to.equal(true);
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

      it('handles failed connection info from RethinkDB', (done) => {
        const { createDatabase } = require('./actions');
        const promise = createDatabase(dbConnection, database)(dispatch);
        promise
          .then(function() {
            done(FALSE_SUCCESS_ERROR);
          })
          .catch(function(er) {
            expect(RethinkDbService.createDb.callCount).to.equal(1);
            expect(RethinkDbService.createDb.calledWith(dbConnection, database.name)).to.equal(true);
            // expect(dispatch.callCount).to.equal(1);
            // const dCall = dispatch.getCall(0);
            // console.log('dCall.args[0]', dCall.args[0]);
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

  describe('createTable', () => {

    const dbConnection = { stuff: 'stuff' };
    const database = { name: 'dbName1', tables: [] };
    const table = { name: 'table1' };

    describe('success', () => {
      beforeEach(function() {
        RethinkDbService.createTable = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve('ok was successfully created.');
        }));
      });

      it('should get a list of tables from a database', (done) => {
        const { createTable } = require('./actions');
        const promise = createTable(dbConnection, database, table)(dispatch);
        promise
          .then(function() {
            expect(RethinkDbService.createTable.callCount).to.equal(1);
            expect(RethinkDbService.createTable.calledWith(dbConnection, database.name, table.name)).to.equal(true);
            expect(dispatch.callCount).to.equal(1);
            expect(dispatch.calledWith({
              type: 'ADD_TO_TABLE_LIST',
              table,
              database
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
        const { createTable } = require('./actions');
        const promise = createTable(dbConnection, database, table)(dispatch);
        promise
          .then(function() {
            done(FALSE_SUCCESS_ERROR);
          })
          .catch(function(er) {
            expect(RethinkDbService.createTable.callCount).to.equal(1);
            expect(RethinkDbService.createTable.calledWith(dbConnection, database.name, table.name)).to.equal(true);
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

  describe('queryTable', () => {

    const dbConnection = { stuff: 'stuff' };
    const databaseName = 'dbName1';
    const tableName = 'table1';
    const queryParams = {
      page: null,
      limit: 10,
      sort: 'name',
      direction: 1 // ASC = 1, DESC = 0
    };

    describe('success', () => {
      beforeEach(function() {
        RethinkDbService.getTableData = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve({ value: [{ name: 'Bob' }, { name: 'Jim' }] });
        }));
        RethinkDbService.getTableDataBetween = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve({ value: [{ name: 'Bob' }, { name: 'Jim' }] });
        }));
      });

      it('should query the table for data with default params', (done) => {
        const { queryTable } = require('./actions');
        const promise = queryTable(dbConnection, databaseName, tableName)(dispatch);
        promise
          .then(function() {
            expect(RethinkDbService.getTableData.callCount).to.equal(1);
            expect(RethinkDbService.getTableData.calledWithExactly(dbConnection, databaseName, tableName, 'id', 0, 5, 1)).to.equal(true);
            expect(dispatch.callCount).to.equal(2);
            expect(dispatch.calledWith({
              type: 'UPDATE_SELECTED_TABLE',
              lastResult: { value: [{ name: 'Bob' }, { name: 'Jim' }] },
              data: [{ name: 'Bob' }, { name: 'Jim' }],
              loading: false
            })).to.equal(true);
            done();
          })
          .catch(done);
      });

      it('should query the table for data with given params', (done) => {
        const { queryTable } = require('./actions');
        const params = Object.assign({}, queryParams, { index: 'name', start: 7, end: 8 });
        const promise = queryTable(dbConnection, databaseName, tableName, params)(dispatch);
        promise
          .then(function() {
            expect(RethinkDbService.getTableDataBetween.callCount).to.equal(1);
            expect(RethinkDbService.getTableDataBetween.calledWithExactly(dbConnection, databaseName, tableName, 'name', 7, 8)).to.equal(true);
            expect(dispatch.callCount).to.equal(2);
            expect(dispatch.calledWith({
              type: 'UPDATE_SELECTED_TABLE',
              lastResult: { value: [{ name: 'Jim' }, { name: 'Bob' }] },
              data: [{ name: 'Jim' }, { name: 'Bob' }],
              loading: false
            })).to.equal(true);
            done();
          })
          .catch(done);
      });

    });

    describe('failure', () => {

      beforeEach(function() {
        RethinkDbService.getTableData = sinon.stub().returns(new Promise(function(resolve, reject) {
          reject('im a query table error');
        }));
        RethinkDbService.getTableDataBetween = sinon.stub().returns(new Promise(function(resolve, reject) {
          reject('im a query table error');
        }));
      });

      it('should handle failed query info from RethinkDB', (done) => {
        const { queryTable } = require('./actions');
        const promise = queryTable(dbConnection, databaseName, tableName)(dispatch);
        promise
          .then(function() {
            done(FALSE_SUCCESS_ERROR);
          })
          .catch(function() {
            expect(RethinkDbService.getTableData.callCount).to.equal(1);
            expect(RethinkDbService.getTableData.calledWithExactly(dbConnection, databaseName, tableName, 'id', 0, 5, 1)).to.equal(true);
            // expect(dispatch.callCount).to.equal(1);
            // expect(dispatch.calledWith({
            //   type: 'UPDATE_SELECTED_TABLE',
            //   lastResult: 'im a query table error',
            //   data: 'im a query table error',
            //   loading: false
            // })).to.equal(true);
            done();
          })
          .catch(done);
      });

      it('should handle failed query info from RethinkDB', (done) => {
        const { queryTable } = require('./actions');
        const params = Object.assign({}, queryParams, { index: 'name', start: 7, end: 8 });
        const promise = queryTable(dbConnection, databaseName, tableName, params)(dispatch);
        promise
          .then(function() {
            done(FALSE_SUCCESS_ERROR);
          })
          .catch(function() {
            expect(RethinkDbService.getTableDataBetween.callCount).to.equal(1);
            expect(RethinkDbService.getTableDataBetween.calledWithExactly(dbConnection, databaseName, tableName, 'name', 7, 8)).to.equal(true);
            // expect(dispatch.callCount).to.equal(1);
            // expect(dispatch.calledWith({
            //   type: 'UPDATE_SELECTED_TABLE',
            //   lastResult: 'im a query table error',
            //   data: 'im a query table error',
            //   loading: false
            // })).to.equal(true);
            done();
          })
          .catch(done);
      });

    });
  });

  describe('deleteDatabase', () => {

    const dbConnection = { stuff: 'stuff' };
    const database = { name: 'dbName1', tables: [] };
    const table = { name: 'table1' };

    describe('success', () => {
      beforeEach(function() {
        RethinkDbService.deleteDb = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve('ok was successfully created.');
        }));
      });

      it('should delete a database', (done) => {
        const { deleteDatabase } = require('./actions');
        const promise = deleteDatabase(dbConnection, database.name)(dispatch);
        promise
          .then(function() {
            expect(RethinkDbService.deleteDb.callCount).to.equal(1);
            expect(RethinkDbService.deleteDb.calledWith(dbConnection, database.name)).to.equal(true);
            expect(dispatch.callCount).to.equal(1);
            expect(dispatch.calledWith({
              type: 'DELETE_DATABASE',
              dbName: database.name
            })).to.equal(true);
            done();
          })
          .catch(done);
      });

    });
  });

  describe('writeConfigFile', () => {

    const state = {
      connections: [{
        authKey: "",
        database: "",
        host: "192.168.99.100",
        identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
        index: 0,
        name: "rethink-tut",
        port: "32769"
      }],
      main: {
        email: 'cassie@codehangar.io',
        dbConnection: { stuff: 'stuff' },
        connection: {
          selected: {
            name: 'localhost',
            host: 'localhost',
            port: 1234
          }
        },
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'table',
          data: [],
          loading: true,
          codeBody: "{\n  \n}",
          codeAction: 'add',
          codeBodyError: null,
          query: {
            page: 1,
            limit: 5,
            sort: 'id',
            direction: 1 // ASC = 1, DESC = 0
          }
        }
      }
    };

    const getState = () => {
      return state;
    };

    describe('success', () => {
      beforeEach(function() {
        configService.writeConfigFile = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve('ok was successfully created.');
        }));
      });

      it('should write the user config file', (done) => {
        const { writeConfigFile } = require('./actions');
        const promise = writeConfigFile()(dispatch, getState);
        promise
          .then(function(resu) {
            expect(configService.writeConfigFile.callCount).to.equal(1);
            expect(configService.writeConfigFile.calledWithExactly({
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
            })).to.equal(true);
            done();
          })
          .catch(done);
      });

    });
  });
});

describe('deleteTable', () => {

  const dbConnection = { stuff: 'stuff' };
  const database = { name: 'dbName1', tables: [{ name: 'table1' }] };
  describe('success', () => {
    beforeEach(function() {
      RethinkDbService.deleteTable = sinon.stub().returns(new Promise(function(resolve, reject) {
        resolve('ok was successfully created.');
      }));
    });

    it('should delete a table', (done) => {
      const { deleteTable } = require('./actions');
      const promise = deleteTable(dbConnection, database.name, 'table1')(dispatch);
      promise
        .then(function() {
          expect(RethinkDbService.deleteTable.callCount).to.equal(1);
          expect(RethinkDbService.deleteTable.calledWith(dbConnection, database.name, 'table1')).to.equal(true);
          // expect(dispatch.callCount).to.equal(1);
          expect(dispatch.calledWith({
            type: 'DELETE_TABLE',
            dbName: database.name,
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
      const { deleteTable } = require('./actions');
      const promise = deleteTable(dbConnection, database.name, 'table1')(dispatch);
      promise
        .then(function() {
          done(FALSE_SUCCESS_ERROR);
        })
        .catch(function(er) {
          expect(RethinkDbService.deleteTable.callCount).to.equal(1);
          expect(RethinkDbService.deleteTable.calledWith(dbConnection, database.name, 'table1')).to.equal(true);
          done();
        })
        .catch(done);
    });

  });
});
