import jdenticon from 'jdenticon';
import md5 from 'md5';
import {
  setConnections,
  setEmail,
  addConnection,
  updateConnection,
  deleteConnection,
  setConnection,
  setDbList,
  setDbTables,
  showConnectionForm,
  hideConnectionForm,
  hideOpenMenus,
  toggleDatabaseForm,
  toggleTableForm,
  addDatabase,
  addTable,
  setDbToEdit,
  setSelectedTable,
  updateSelectedTable,
  updateSelectedTablePageLimit
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
    it('adds saved connections to the main app state', () => {
      const state = {};
      const connections = ['connection1', 'connection2'];
      let nextState = setConnections(state, connections);
      expect(nextState).to.deep.equal({
        main: {
          connections: ['connection1', 'connection2']
        }
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
      };
      const mode = 'NEW';
      const nextState = showConnectionForm(state, mode);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        showAddConnectionForm: true
      });
    })

    it('clears the selectedConnection if mode is NEW', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          name: 'localhost',
          host: 'localhost',
          port: 1234
        }
      };
      const mode = 'NEW';
      const nextState = showConnectionForm(state, mode);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        showAddConnectionForm: true
      });
    })

    it('shows the edit connection form if mode is EDIT', () => {
      const state = {
        email: 'cassie@codehangar.io',
        showAddConnectionForm: true
      };
      const selectedConnection = {
        name: 'localhost',
        host: 'localhost',
        port: 1234
      };
      const mode = 'EDIT';
      const nextState = showConnectionForm(state, mode, selectedConnection);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        showEditConnectionForm: true,
        selectedConnection: {
          name: 'localhost',
          host: 'localhost',
          port: 1234
        }
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
    it('adds a new connection to the redux store and sets selectedConnection', () => {
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
        }],
        selectedConnection: {
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

  describe('updateConnection', () => {

    it('updates modified connection info in application state', () => {
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
        }, {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1,
          name: "apple",
          port: "32769"
        }]
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

      // console.log('UPDATE CONNECTION TEST nextState',nextState)

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
        }, {
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

  describe('deleteConnection', () => {
    it('removes connection from application state', () => {
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
        }, {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1,
          name: "apple",
          port: "32769"
        }]
      }

      const connectionIndex = 0;

      const nextState = deleteConnection(state, connectionIndex);

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        connections: [{
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1,
          name: "apple",
          port: "32769"
        }]
      })

    })

    it('deletes the selectedConnection if no other connections exist', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "apple",
          port: "32769"
        },
        connections: [{
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "apple",
          port: "32769"
        }]
      }

      const connectionIndex = 0;

      const nextState = deleteConnection(state, connectionIndex);

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        connections: []
      })
    })

    it('sets a new selectedConnection if another connections exist', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "apple",
          port: "32769"
        },
        connections: [{
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769"
        }, {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1,
          name: "apple",
          port: "32769"
        }]
      }

      const connectionIndex = 0;

      const nextState = deleteConnection(state, connectionIndex);

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1,
          name: "apple",
          port: "32769"
        },
        connections: [{
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 1,
          name: "apple",
          port: "32769"
        }]
      })
    })
  })

  describe('setConnection', () => {
    it('sets a new selectedConnection to the redux store', () => {
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
        selectedConnection: {
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

  describe('createDatabase', () => {
    it('createDatabase', () => {

    })
  })

  describe('setDbList', () => {
    it('setDbList should add databases array to selectedConnection object', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769"
        }
      };
      const databases = [{
        name: 'Test',
        tables: []
      }, {
        name: 'Test2',
        tables: []
      }];
      let nextState = setDbList(state, databases);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769",
          databases: [{
            name: 'Test',
            tables: []
          }, {
            name: 'Test2',
            tables: []
          }]
        }
      });
    });
  });

  describe('setDbTables', () => {
    it('should add tables array to appropriate database object', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769",
          databases: [{
            name: 'DB1',
            tables: []
          }, {
            name: 'DB2',
            tables: []
          }]
        }
      };
      const tables = ['Table1', 'Table2'];
      let nextState = setDbTables(state, state.selectedConnection.databases[0].name, tables);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769",
          databases: [{
            name: 'DB1',
            tables: ['Table1', 'Table2']
          }, {
            name: 'DB2',
            tables: []
          }]
        }
      });
    });

    it('should not die when there are no tables in dat base', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769",
          databases: [{
            name: 'DB1',
            tables: []
          }, {
            name: 'DB2',
            tables: []
          }]
        }
      };
      const tables = [];
      let nextState = setDbTables(state, state.selectedConnection.databases[1].name, tables);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "rethink-tut",
          port: "32769",
          databases: [{
            name: 'DB1',
            tables: []
          }, {
            name: 'DB2',
            tables: []
          }]
        }
      });
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

  describe('toggleDatabaseForm', () => {
    it('should return new state with showDatabaseForm set to true', () => {
      const state = {
        email: 'ian@codehangar.io',
        showDatabaseForm: false
      };

      const nextState = toggleDatabaseForm(state, true);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showDatabaseForm: true
      });
    });

    it('should return new state with showDatabaseForm set to false', () => {
      const state = {
        email: 'ian@codehangar.io',
        showDatabaseForm: true
      };

      const nextState = toggleDatabaseForm(state, false);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showDatabaseForm: false
      });
    });
  });

  describe('toggleTableForm', () => {
    it('should return new state with showTableForm set to true', () => {
      const state = {
        email: 'ian@codehangar.io',
        showTableForm: false
      };

      const nextState = toggleTableForm(state, true);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showTableForm: true
      });
    });

    it('should return new state with showTableForm set to false', () => {
      const state = {
        email: 'ian@codehangar.io',
        showTableForm: true
      };

      const nextState = toggleTableForm(state, false);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showTableForm: false
      });
    });
  });

  describe('addDatabase', () => {
    it('add database object to selectedConnection databases array', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "apple",
          port: "32769"
        }
      }

      const database = {
        name: 'new',
        tables: []
      }

      let nextState = addDatabase(state, database);

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "apple",
          port: "32769",
          databases: [{
            name: 'new',
            tables: []
          }]
        }
      });

    });
  });

  describe('addTable', () => {
    it('add table name to tables array of the appropriate database object', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "apple",
          port: "32769",
          databases: [{
            name: 'ReQL',
            tables: []
          }]
        }
      }

      const table = {
        name: 'users'
      }

      let nextState = addTable(state, state.selectedConnection.databases[0], table);

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        selectedConnection: {
          authKey: "",
          database: "",
          host: "192.168.99.100",
          identicon: jdenticon.toSvg(md5("rethink-tut"), 40),
          index: 0,
          name: "apple",
          port: "32769",
          databases: [{
            name: 'ReQL',
            tables: ['users']
          }]
        }
      });

    });
  });

  describe('setDbToEdit', () => {
    it('sets dbToEdit to main state', () => {
      const state = {}
      const database = {
        name: 'ReQL'
      }
      const nextState = setDbToEdit(state, database);
      expect(nextState).to.deep.equal({
        dbToEdit: {
          name: 'ReQL'
        }
      });
    });
  });

  describe('setSelectedTable', () => {
    it('sets selectedTable from database name and table name', () => {
      const state = {}
      const table = {
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
      };

      const nextState = setSelectedTable(state, 'databaseName', 'tableName');

      expect(nextState).to.deep.equal({
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
      });
    });
  });

    describe('updateSelectedTable', () => {
    it('adds table data to selectedTable and sets loading to false', () => {
      const state = {
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
      const data = ['stuff'];

      const nextState = updateSelectedTable(state, data);

      expect(nextState).to.deep.equal({
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'table',
          data: ['stuff'],
          loading: false,
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
      });
    });
  });

  describe('updateSelectedTablePageLimit', () => {
    it('updates selectedTable.query.limit to new value', () => {
      const state = {
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'table',
          data: ['stuff'],
          loading: false,
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
      const limit = '10'
      const nextState = updateSelectedTablePageLimit(state, limit);
      expect(nextState).to.deep.equal({
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'table',
          data: ['stuff'],
          loading: false,
          codeBody: "{\n  \n}",
          codeAction: 'add',
          codeBodyError: null,
          query: {
            page: 1,
            limit: 10,
            sort: 'id',
            direction: 1 // ASC = 1, DESC = 0
          }
        }
      });
    });
  });

});
