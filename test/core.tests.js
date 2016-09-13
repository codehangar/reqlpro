import jdenticon from 'jdenticon';
import md5 from 'md5';
import {
  setConnections,
  setEmail,
  addConnection,
  updateConnection,
  setConnection,
  showConnectionForm,
  hideConnectionForm,
  getConnection,
  toggleConnectionActionMenu,
  hideOpenMenus
} from '../public/core';

let RethinkDbService;

describe('Application Logic', () => {

  beforeEach(function() {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    // Mock the rethinkdb service
    RethinkDbService = sinon.stub();
    RethinkDbService.getConnection = sinon.stub().returns(new Promise(function(resolve, reject) {
      resolve('im a conn')
    }));

    // replace the require() module `rethinkdb` with a stub object
    mockery.registerMock('../main/services/rethinkdb.service', RethinkDbService);

  });

  describe('setConnections', () => {
    it('adds saved connections to the state', () => {
      const state = {};
      const connections = ['connection1', 'connection2'];
      let nextState = setConnections(state, connections);
      expect(nextState).to.deep.equal({
        connections: ['connection1', 'connection2']
      });
    });
  });

  describe('setEmail', () => {
    it('adds email to redux store', () => {
      const state = {};
      const email = 'cassie@codehangar.io';
      let nextState = setEmail(state, email);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io'
      });
    });
  });

  describe('showConnectionForm', () => {
    it('shows the add connection form if mode is NEW', () => {
      const state = {
        email: 'cassie@codehangar.io'
      }
      const mode = 'NEW';
      const nextState = showConnectionForm(state, mode);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        showAddConnectionForm: true
      })
    })
    it('shows the edit connection form if mode is EDIT', () => {
      const state = {
        email: 'cassie@codehangar.io',
        showAddConnectionForm: true
      }
      const mode = 'EDIT';
      const nextState = showConnectionForm(state, mode);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        showEditConnectionForm: true
      })
    })
  });

  describe('hideConnectionForm', () => {
    it('removes showAddConnectionForm and/or showEditConnectionForm from Redux store', () => {
      const state = {
        email: 'cassie@codehangar.io',
        showAddConnectionForm: true
      }
      const nextState = hideConnectionForm(state);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io'
      });
      const state2 = {
        email: 'cassie@codehangar.io',
        showEditConnectionForm: true
      }
      const nextState2 = hideConnectionForm(state2);
      expect(nextState2).to.deep.equal({
        email: 'cassie@codehangar.io'
      });
    });
  });

  describe('addConnection', () => {
    it('adds a new connection to the redux store', () => {
      const state = {
        email: 'cassie@codehangar.io'
      }
      const connection = {
        authKey: "",
        database: "",
        host: "192.168.99.100",
        identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
        index: 0,
        name: "rethink-tut",
        port: "32769"
      }
      const nextState = addConnection(state, connection);
      expect(nextState).to.deep.equal({
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
      })
    });
  });

  describe('updateConnection', () => {
    it('updates modified connection info in the redux store', () => {
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
        },
        {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1,
          name: "apple",
          port: "32769"
        }
        ]
      }
      const updatedConnection = {
        authKey: "",
        database: "",
        host: "192.168.99.100",
        identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
        index: 1,
        name: "banana",
        port: "32769"
      }
      const nextState = updateConnection(state, updatedConnection);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        connections: [{
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769"
        },
        {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1,
          name: "banana",
          port: "32769"
        }]
      })
    });
  });

  describe('getConnection', () => {

    it('returns connection info from RethinkDB', (done) => {
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
      }
      const connection = state.connections[0];
      const dispatch = sinon.stub();

      const promise = getConnection(dispatch, connection);

      expect(RethinkDbService.getConnection.callCount).to.equal(1);
      expect(RethinkDbService.getConnection.calledWith("192.168.99.100", "32769", "")).to.equal(true);

      promise.then((conn) => {
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.calledWith({
          type: 'SET_CONNECTION',
          connection: 'im a conn'
        })).to.be.true;
        done();
      }).catch(reason => {
        done(reason)
      });

    });
  });

  describe('setConnection', () => {
    it('sets a new selectedFavorite to the redux store', () => {
      const state = {
        email: 'ian@codehangar.io'
      }
      const connection = {
        authKey: "",
        database: "",
        host: "192.168.99.100",
        identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
        index: 0,
        name: "rethink-tut",
        port: "32769"
      }
      const nextState = setConnection(state, connection);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        selectedFavorite: {
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

  describe('toggleConnectionActionMenu', () => {
    it('should set state.showConnectionActionMenu to true, if true is passed in', () => {
      const state = {
        email: 'ian@codehangar.io'
      }

      const nextState = toggleConnectionActionMenu(state, true);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showConnectionActionMenu: true
      })
    });

    it('should set state.showConnectionActionMenu to false, if false is passed in', () => {
      const state = {
        email: 'ian@codehangar.io'
      }

      const nextState = toggleConnectionActionMenu(state, false);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showConnectionActionMenu: false
      })
    });

    it('should set state.showConnectionActionMenu to false, if nothing is passed in, and existing value is true', () => {
      const state = {
        email: 'ian@codehangar.io',
        showConnectionActionMenu: true
      }

      const nextState = toggleConnectionActionMenu(state);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showConnectionActionMenu: false
      })
    });

    it('should set state.showConnectionActionMenu to true, if nothing is passed in, and existing value is false', () => {
      const state = {
        email: 'ian@codehangar.io',
        showConnectionActionMenu: false
      }

      const nextState = toggleConnectionActionMenu(state);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showConnectionActionMenu: true
      })
    });

  });

  describe('hideOpenMenus', () => {
    it('should return new state with passed in state props set to false', () => {
      const state = {
        email: 'ian@codehangar.io',
        showConnectionActionMenu: true,
        showAddConnectionForm: false
      }
      const statePropsToUpdate = ['showConnectionActionMenu', 'showAddConnectionForm']

      const nextState = hideOpenMenus(state, statePropsToUpdate);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showConnectionActionMenu: false,
        showAddConnectionForm: false
      })
    });

    it('should return current state if no state props passed in', () => {
      const state = {
        email: 'ian@codehangar.io',
        showConnectionActionMenu: true,
        showAddConnectionForm: false
      }
      const statePropsToUpdate = ['showConnectionActionMenu', 'showAddConnectionForm']

      const nextState = hideOpenMenus(state);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showConnectionActionMenu: true,
        showAddConnectionForm: false
      })
    });

  });

});
