// import jdenticon from 'jdenticon';
// import md5 from 'md5';

// // Can't use import syntax when we need to mock 
// // import {
//   // getDbConnection,
// // } from '../public/actions';

// let RethinkDbService;

// describe('Action Creators', () => {

//   beforeEach(function() {

//     mockery.enable({
//       warnOnReplace: false,
//       warnOnUnregistered: false,
//       useCleanCache: true
//     });

//     // Mock the rethinkdb service
//     RethinkDbService = sinon.stub();
//     RethinkDbService.getConnection = sinon.stub().returns(new Promise(function(resolve, reject) {
//       resolve('im a conn')
//     }));

//     // replace the require() module `rethinkdb` with a stub object
//     mockery.registerMock('../main/services/rethinkdb.service', RethinkDbService);

//   });

//   // Looks like this function has been moved to actions.js
//   // Not sure how to best fix this broken test but 
//   // I am focused on something else right now -Cassie

//   describe('getDbConnection', () => {

//     it('returns connection info from RethinkDB', (done) => {
//       const {getDbConnection} = require('../public/actions');

//       const state = {
//         email: 'cassie@codehangar.io',
//         connections: [{
//           authKey: "",
//           database: "",
//           host: "192.168.99.100",
//           identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
//           index: 0,
//           name: "rethink-tut",
//           port: "32769"
//         }]
//       }
//       const connection = state.connections[0];
//       // const dispatch = sinon.stub();

//       const promise = getDbConnection(connection);

//       expect(RethinkDbService.getConnection.callCount).to.equal(1);
//       expect(RethinkDbService.getConnection.calledWith("192.168.99.100", "32769", "")).to.equal(true);

//       // promise.then((conn) => {
//         // expect(dispatch.callCount).to.equal(1);
//       //   expect(dispatch.calledWith({
//       //     type: 'SET_DB_CONNECTION',
//       //     dbConnection: 'im a conn'
//       //   })).to.be.true;
//       //   done();
//       // }).catch(reason => {
//       //   done(reason)
//       // });

//     });
//   });


// });
