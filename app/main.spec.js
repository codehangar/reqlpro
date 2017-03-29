// import { remote, ipcRenderer } from 'electron';
// import { createInitialState } from './main';

let ConfigService,  electron, Segment, global, AnonIdStub;

describe('initApp', () => {

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    // Mock dependencies
    ConfigService = sinon.stub();
    mockery.registerMock('./services/config.service', ConfigService);
    ConfigService.readConfigFile = sinon.stub().returns(Promise.resolve({}));

    electron = {};
    mockery.registerMock('electron', electron);
    electron.remote = sinon.stub();
    electron.remote.getGlobal = sinon.stub();

    Segment = sinon.stub();
    mockery.registerMock('./services/segment.service', Segment);

    var stub = sinon.stub();
    AnonIdStub = sinon.createStubInstance(stub);
    mockery.registerMock('./services/anon-id.service', AnonIdStub);

    // var AnonId = sinon.createStubInstance();

    global = {};
    global.configPath = '';

    // import AnonId from './anon-id.service';

  });

  describe('createInitialState', () => {


    it('should take the user config file and return initial app state object', () => {

      const { createInitialState } = require('./main');
      let fakeConfigFile, fakeState, actual;

      // test 1 no config file
      fakeConfigFile ={};
      fakeState = {
        connection: {},
        connections: [],
        main: {
          email: null
        }
      };
      actual = createInitialState(fakeConfigFile);
      expect(actual).to.eql(fakeState);

      //test 2 config with connections
      fakeConfigFile =  {
        email: 'cassie@codehangar.io',
        connections: [
          'connection1', 'connection2'
        ]
      };
      fakeState = {
        main: { email: 'cassie@codehangar.io' },
        connections: [
          'connection1', 'connection2'
        ],
        connection: {
          selected: 'connection1'
        }
      };
      actual = createInitialState(fakeConfigFile);
      expect(actual).to.eql(fakeState);

      //test 3 config without connections
      fakeConfigFile = {
        email: 'cassie@codehangar.io',
      };
      fakeState = {
        main: { email: 'cassie@codehangar.io' },
        connections: [],
        connection: {}
      };
      actual = createInitialState(fakeConfigFile);
      expect(actual).to.eql(fakeState);

    });
  });


});
