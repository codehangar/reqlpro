import jdenticon from 'jdenticon';
import md5 from 'md5';

// Can't use import syntax when we need to mock
// import {
// getDbConnection,
// } from '../public/actions';

let RethinkDbService;
let getConnectionSuccess;
let getConnectionFailure;
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

    getConnectionSuccess = sinon.stub().returns(new Promise(function(resolve, reject) {
      resolve('im a connection');
    }));

    getConnectionFailure = sinon.stub().returns(new Promise(function(resolve, reject) {
      reject('im a connection error');
      // resolve('im a connection error');
    }));


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
        RethinkDbService.getConnection = getConnectionSuccess;
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
        RethinkDbService.getConnection = getConnectionFailure;
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


});
