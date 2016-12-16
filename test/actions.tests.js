import jdenticon from 'jdenticon';
import md5 from 'md5';

// Can't use import syntax when we need to mock
// import {
// getDbConnection,
// } from '../public/actions';

let RethinkDbService;
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
        const {getDbConnection} = require('../public/actions');

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
        const {getDbConnection} = require('../public/actions');
        const promise = getDbConnection(connection)(dispatch);
        promise
          .then(function() {
            done(FALSE_SUCCESS_ERROR);
          })
          .catch(function(er) {
            console.log('er', er);
            expect(RethinkDbService.getConnection.callCount).to.equal(1);
            expect(RethinkDbService.getConnection.calledWith('192.168.99.100', '32769', '')).to.equal(true);
            expect(dispatch.callCount).to.equal(1);
            expect(dispatch.calledWith({
              type: 'SET_DB_CONNECTION',
              dbConnection: 'im a connection error'
            })).to.equal(true);
            done();
          })
          .catch(done);
      });

    });
  });

  describe('getDbList', () => {

    const state = {
      email: 'cassie@codehangar.io',
      dbConnection: {stuff: 'stuff'}
    };
    const databases = ['dbName1', 'dbName2'];

    describe('success', () => {
      beforeEach(function() {
        RethinkDbService.getDbList = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve(databases);
        }));
      });

      it('get list of databases from dbConnection', (done) => {
        const {getDbList} = require('../public/actions');
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
                {name: 'dbName1', tables: []},
                {name: 'dbName2', tables: []}
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
        const {getDbList} = require('../public/actions');
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
            expect(dispatch.callCount).to.equal(1);
            const dCall = dispatch.getCall(0);
            console.log('dCall.args[0]', dCall.args[0]);
            expect(dispatch.calledWith({
              type: 'SET_DB_LIST',
              databases: 'im a dbList fetching error'
            })).to.equal(true);
            done();
          })
          .catch(done);
      });

    });
  });

  describe('getDbTables', () => {

    const dbConnection = {stuff: 'stuff'};
    const database = {name: 'dbName1', tables: []};

    describe('success', () => {
      beforeEach(function() {
        RethinkDbService.getTableList = sinon.stub().returns(new Promise(function(resolve, reject) {
          resolve(['table1', 'table2']);
        }));
      });

      it('should get a list of tables from a database', (done) => {
        const {getDbTables} = require('../public/actions');
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
        const {getDbTables} = require('../public/actions');
        const promise = getDbTables(dbConnection, database)(dispatch);
        promise
          .then(function() {
            done(FALSE_SUCCESS_ERROR);
          })
          .catch(function(er) {
            expect(RethinkDbService.getTableList.callCount).to.equal(1);
            expect(RethinkDbService.getTableList.calledWith(dbConnection, database.name)).to.equal(true);
            expect(dispatch.callCount).to.equal(1);
            const dCall = dispatch.getCall(0);
            console.log('dCall.args[0]', dCall.args[0]);
            expect(dispatch.calledWith({
              type: 'SET_DB_TABLES',
              tables: 'im a db tables fetching error'
            })).to.equal(true);
            done();
          })
          .catch(done);
      });

    });
  });


});
