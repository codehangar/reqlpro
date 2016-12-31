import jdenticon from 'jdenticon';
import md5 from 'md5';
import freeze from 'deep-freeze-node';
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
  toggleDeleteDatabaseForm,
  toggleTableForm,
  toggleDeleteTableForm,
  addDatabase,
  addTable,
  toggleTableVisibility,
  setDbToEdit,
  setSelectedTable,
  updateSelectedTable,
  updateSelectedTablePageLimit,
  updateSelectedTableSort,
  setSelectedTableSize,
  startRowEdit,
  cancelRowEdit,
  toggleExplorerBody,
  deleteDatabase,
  deleteTable,
  setCodeBodyError,
  setCodeBody,
  setLastDbResult
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

  describe('toggleDeleteDatabaseForm', () => {
    it('should return new state with showDeleteDatabaseForm set to true, and dbToDelete set', () => {
      const state = {
        email: 'ian@codehangar.io',
        showDeleteDatabaseForm: false
      };

      const nextState = toggleDeleteDatabaseForm(state, true, 'test');

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showDeleteDatabaseForm: true,
        dbToDelete: 'test'
      });
    });

    it('should return new state with showDatabaseForm set to false', () => {
      const state = {
        email: 'ian@codehangar.io',
        showDeleteDatabaseForm: true
      };

      const nextState = toggleDeleteDatabaseForm(state, false);

      expect(nextState).to.deep.equal({
        email: 'ian@codehangar.io',
        showDeleteDatabaseForm: false
      });
    });
  });

  describe('toggleDeleteTableForm', () => {
    it('should return new state with showDeleteTableForm set to true, and tableToDelete and selectedDatabase set', () => {
      const state = {
        email: 'cassie@codehangar.io',
        showDeleteTableForm: false
      };

      const nextState = toggleDeleteTableForm(state, true, {database: 'database'}, 'test');

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        showDeleteTableForm: true,
        tableToDelete: 'test',
        selectedDatabase: {database: 'database'}
      });
    });

    it('should return new state with showDatabaseForm set to false', () => {
      const state = {
        email: 'cassie@codehangar.io',
        showDeleteTableForm: true
      };

      const nextState = toggleDeleteTableForm(state, false);

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        showDeleteTableForm: false
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
      };

      const table = {
        name: 'users'
      };

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

  describe('toggleTableVisibility', () => {
    it('should set the visibility of tables of the appropriate database object to true', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          name: "apple",
          databases: [{
            name: 'myDatabaseName1',
            tables: ['users']
          }, {
            name: 'myDatabaseName2',
            tables: ['users']
          }, {
            name: 'myDatabaseName3',
            tables: ['users']
          }]
        }
      };

      const nextState = toggleTableVisibility(state, state.selectedConnection.databases[1], true);

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        selectedConnection: {
          name: "apple",
          databases: [{
            name: 'myDatabaseName1',
            tables: ['users']
          }, {
            name: 'myDatabaseName2',
            tables: ['users'],
            showTables: true
          }, {
            name: 'myDatabaseName3',
            tables: ['users']
          }]
        }
      });

    });

    it('should set the visibility of tables of the appropriate database object to false', () => {
      const state = {
        email: 'cassie@codehangar.io',
        selectedConnection: {
          name: "apple",
          databases: [{
            name: 'myDatabaseName1',
            tables: ['users']
          }, {
            name: 'myDatabaseName2',
            tables: ['users']
          }, {
            name: 'myDatabaseName3',
            tables: ['users'],
            showTables: true
          }]
        }
      };

      const nextState = toggleTableVisibility(state, state.selectedConnection.databases[2], false);

      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        selectedConnection: {
          name: "apple",
          databases: [{
            name: 'myDatabaseName1',
            tables: ['users']
          }, {
            name: 'myDatabaseName2',
            tables: ['users']
          }, {
            name: 'myDatabaseName3',
            tables: ['users'],
            showTables: false
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
      };
      const data = ['stuff'];
      const lastResult = {
        profile: [{
          description: "Evaluating slice.",
          'duration(ms)': 51.496578
        }]
      };

      const nextState = updateSelectedTable(state, data, lastResult);

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
          lastResult: {
            profile: [{
              description: "Evaluating slice.",
              'duration(ms)': 51.496578
            }]
          },
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

  describe('updateSelectedTableSort', () => {
    it('updates selectedTable.query.sort to new value and reverses selectedTable.query.direction', () => {
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
      const sort = 'name'
      const nextState = updateSelectedTableSort(state, sort);
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
            sort: 'name',
            direction: 0 // ASC = 1, DESC = 0
          }
        }
      });
    });

    it('updates selectedTable.query.sort to new value and reverses selectedTable.query.direction back', () => {
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
            direction: 0 // ASC = 1, DESC = 0
          }
        }
      }
      const sort = 'name'
      const nextState = updateSelectedTableSort(state, sort);
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
            sort: 'name',
            direction: 1 // ASC = 1, DESC = 0
          }
        }
      });
    });
  });

  describe('setSelectedTableSize', () => {
    it('should set selectedTable.size to new value', () => {
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
      const size = 27;
      const nextState = setSelectedTableSize(state, size);
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
          size: 27,
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

  describe('startRowEdit', () => {
    it('updates selectedTable fields: type, previousType, codeBody, codeAction, codeBodyError, editingRecord', () => {
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
            direction: 1
          }
        }
      };

      const record = {
        id: 'some-id',
        fieldA: 'some field',
      };

      const nextState = startRowEdit(state, record);
      expect(nextState).to.deep.equal({
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'code',
          data: ['stuff'],
          loading: false,
          codeBody: JSON.stringify(record, null, '  '),
          codeAction: 'update',
          codeBodyError: null,
          query: {
            page: 1,
            limit: 5,
            sort: 'id',
            direction: 1
          },
          editingRecord: record,
          previousType: 'table',
        }
      });
    });
  });

  describe('cancelRowEdit', () => {
    it('updates selectedTable fields: type, previousType, codeBody, codeAction, codeBodyError, editingRecord', () => {
      const state = {
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'code',
          data: ['stuff'],
          loading: false,
          codeAction: 'update',
          codeBody: JSON.stringify(record, null, '  '),
          codeBodyError: 'Some Error',
          query: {
            page: 1,
            limit: 5,
            sort: 'id',
            direction: 1
          },
          editingRecord: {
            id: 'some-id',
            fieldA: 'some field',
          },
          previousType: 'table',
        }
      };

      const record = {
        id: 'some-id',
        fieldA: 'some field',
      };

      const nextState = cancelRowEdit(state, record);
      expect(nextState).to.deep.equal({
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'table',
          data: ['stuff'],
          loading: false,
          codeAction: 'add',
          codeBody: "{\n  \n}",
          codeBodyError: null,
          query: {
            page: 1,
            limit: 5,
            sort: 'id',
            direction: 1
          },
          editingRecord: null,
          previousType: null,
        }
      });
    });
  });

  describe('toggleExplorerBody', () => {
    it('switches selectedTable type to tree', () => {
      const state = {
        selectedTable: {
          type: 'table',
        }
      };

      const nextState = toggleExplorerBody(state, 'tree');
      expect(nextState).to.deep.equal({
        selectedTable: {
          type: 'tree',
          previousType: 'table'
        }
      });
    });

    it('switches selectedTable type to table', () => {
      const state = {
        selectedTable: {
          type: 'tree',
        }
      };

      const nextState = toggleExplorerBody(state, 'table');
      expect(nextState).to.deep.equal({
        selectedTable: {
          type: 'table',
          previousType: 'tree'
        }
      });
    });

    it('switches selectedTable type to code and sets codeAction to add, codeBody to some JSON, and codeBodyError to null', () => {
      const state = {
        selectedTable: {
          type: 'tree',
        }
      };

      const nextState = toggleExplorerBody(state, 'code');
      expect(nextState).to.deep.equal({
        selectedTable: {
          type: 'code',
          previousType: 'tree',
          codeAction: 'add',
          codeBody: "{\n  \n}",
          codeBodyError: null
        }
      });
    });
  });

  describe('deleteDatabase', () => {
    it('removes database from selectedConnection', () => {
      let state = {
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
          }, {
            name: 'Test',
            tables: ['users']
          }]
        }
      }

      state = freeze(state);
      const dbName = "Test";

      const nextState = deleteDatabase(state, dbName);
      expect(nextState).to.deep.equal({
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

  describe('deleteTable', () => {
    it('removes table from selectedConnection', () => {
      let state = {
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
            tables: ['users1', 'kittens']
          },
            {
              name: 'Test',
              tables: ['users2']
            }]
        }
      }

      state = freeze(state);
      const tableName = "kittens";
      const databaseName = 'ReQL';

      const nextState = deleteTable(state, databaseName, tableName);
      expect(nextState).to.deep.equal({
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
            tables: ['users1']
          }, {
            name: 'Test',
            tables: ['users2']
          }]
        }
      });
    });
  });

  describe('setCodeBodyError', () => {
    it('should set the codeBodyError on the selectedTable', () => {
      let state = {
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
      };

      state = freeze(state);
      const codeBodyError = "It's illegal to insert new rows into the `rethinkdb.cluster_config` table.";

      const nextState = setCodeBodyError(state, codeBodyError);
      expect(nextState).to.deep.equal({
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'table',
          data: [],
          loading: true,
          codeBody: "{\n  \n}",
          codeAction: 'add',
          codeBodyError: "It's illegal to insert new rows into the `rethinkdb.cluster_config` table.",
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

  describe('setCodeBody', () => {
    it('should set the codeBody on the selectedTable', () => {
      let state = {
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
      };

      state = freeze(state);
      const codeBody = "{\n  name: 'bob'\n}";

      const nextState = setCodeBody(state, codeBody);
      expect(nextState).to.deep.equal({
        selectedTable: {
          databaseName: 'databaseName',
          name: 'tableName',
          type: 'table',
          data: [],
          loading: true,
          codeBody: "{\n  name: 'bob'\n}",
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

  describe('setLastDbResult', () => {
    it('should set the lastResult on the selectedTable', () => {
      let state = {
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
      };

      state = freeze(state);
      const lastResult = {
        profile: [{
          description: "Evaluating insert.",
          'duration(ms)': 51.496578
        }],
        value: {
          deleted: 0,
          errors: 0,
          generated_keys: [],
          inserted: 1,
          replaced: 0,
          skipped: 0,
          unchanged: 0
        }
      };

      const nextState = setLastDbResult(state, lastResult);
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
          lastResult: {
            profile: [{
              description: "Evaluating insert.",
              'duration(ms)': 51.496578
            }],
            value: {
              deleted: 0,
              errors: 0,
              generated_keys: [],
              inserted: 1,
              replaced: 0,
              skipped: 0,
              unchanged: 0
            }
          },
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

});
