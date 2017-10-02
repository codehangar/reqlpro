import * as core from './core';
import { main } from './main.reducer';
import store from './store';

let ConfigService, electron, HS, _store, KeychainService;
// let remote;
require.context = function() {
};
describe('main', () => {

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    // Mock dependencies
    ConfigService = sinon.stub();
    mockery.registerMock('./services/config.service', ConfigService);
    ConfigService.readConfigFile = sinon.stub().returns(new Promise(function() {
    }));

    mockery.registerMock('./components/Sidebar/Connections/selectedConnection.actions', sinon.stub());
    mockery.registerMock('./components/App/App', sinon.stub());

    mockery.registerMock("../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss", sinon.stub());
    mockery.registerMock("../node_modules/font-awesome/scss/font-awesome.scss", sinon.stub());
    mockery.registerMock("./styles/index.scss", sinon.stub());

    KeychainService = sinon.stub();
    KeychainService.getKeysForConnection = sinon.stub().returns(Promise.resolve({ pass: '', ca: '' }));
    mockery.registerMock("./services/keychain.service", KeychainService);

    electron = sinon.stub();
    electron.ipcRenderer = {
      on: function(message, callback) {
        this.callbacks = this.callbacks || {};
        this.callbacks[message] = callback;
      },
      once: function(message, callback) {
        this.callbacks = this.callbacks || {};
        this.callbacks[message] = callback;
      },
      send: function(message, payload) {
        this.message = message;
        setTimeout(() => {
          if (payload.responseEventName) {
            this.callbacks[payload.responseEventName]({}, { pass: '', ca: '' });
          }
        }, 100);
      }
    };
    mockery.registerMock('electron', electron);

  });


  describe('initApp', () => {

    beforeEach(function() {
      _store = sinon.stub();
      _store.dispatch = sinon.stub();
      mockery.registerMock('./store', _store);
    });

    it('should call ConfigService.readConfigFile', () => {
      require('./main');
      expect(ConfigService.readConfigFile.callCount).to.equal(1);
    });

    it('should call HS.beacon.open if triggered');

  });

  describe('createInitialState', () => {
    beforeEach(function() {
      _store = sinon.stub();
      _store.dispatch = sinon.stub();
      mockery.registerMock('./store', _store);
    });
    it('should take empty user config file and return initial app state object', (done) => {
      const { createInitialState } = require('./main');
      const fakeConfigFile = {};
      const fakeState = {
        connection: {},
        connections: [],
        main: {
          email: null
        }
      };

      createInitialState(fakeConfigFile)
        .then((actual) => {
          expect(actual).to.eql(fakeState);
          done();
        });
    });
    it('should take user config file with email and no connections and return initial app state object', (done) => {
      const { createInitialState } = require('./main');
      const fakeConfigFile = {
        email: 'cassie@codehangar.io',
      };
      const fakeState = {
        main: { email: 'cassie@codehangar.io' },
        connections: [],
        connection: {}
      };
      createInitialState(fakeConfigFile)
        .then((actual) => {
          expect(actual).to.eql(fakeState);
          done();
        });
    });
    it('should take user config file with email and connections and return initial app state object', (done) => {
      const { createInitialState } = require('./main');
      const fakeConfigFile = {
        email: 'cassie@codehangar.io',
        connections: [
          { name: 'connection1', index: 0 }, { name: 'connection2', index: 1 }
        ]
      };
      const fakeState = {
        main: { email: 'cassie@codehangar.io' },
        connections: [
          { name: 'connection1', index: 0, pass: '', ca: '' }, { name: 'connection2', index: 1, pass: '', ca: '' }
        ],
        connection: {
          selected: { name: 'connection1', index: 0, pass: '', ca: '' }
        }
      };
      createInitialState(fakeConfigFile)
        .then((actual) => {
          expect(actual).to.eql(fakeState);
          done();
        });
    });
  });
  //
  describe('main.reducer', () => {
    //
    it('should call core.setEmail for dispatch type SET_EMAIL', () => {
      //     core.setEmail = sinon.spy();
      //     console.log(store.getState());
      //     store.dispatch({
      //       type: 'SET_EMAIL',
      //       email: 'cassie@codehangar.io',
      //       created: '1/1/17'
      //     });
      //     expect(core.setEmail.callCount).to.equal(1);
    });
  });


});
