import jdenticon from 'jdenticon';
import md5 from 'md5';
import freeze from 'deep-freeze-node';
import {
  setEmail,
  addConnection,
  updateConnection,
  deleteConnection,
  setConnection,
  setDbList,
  setDbTables,
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
  setLastDbResult,
  toggleConfirmRowDelete,
  setRowDeleteError,
  setConnectionError,
  setColumnWidths
} from './core';

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

  describe('toggleConfirmRowDelete', () => {
    it('should set showConfirmRowDelete to true and rowToDelete on the main state', () => {
      let state = {};
      state = freeze(state);
      const rowToDelete = {
        id: '1a12c625-de63-44af-88a7-1a59030ec757',
        name: 'bob'
      };
      const nextState = toggleConfirmRowDelete(state, rowToDelete);
      expect(nextState).to.deep.equal({
        showConfirmRowDelete: true,
        rowToDelete: {
          id: '1a12c625-de63-44af-88a7-1a59030ec757',
          name: 'bob'
        }
      });
    });

    it('should set showConfirmRowDelete to false and remove rowToDelete from the main state', () => {
      let state = {
        showConfirmRowDelete: true,
        rowToDelete: {
          id: '1a12c625-de63-44af-88a7-1a59030ec757',
          name: 'bob'
        }
      };
      state = freeze(state);
      const nextState = toggleConfirmRowDelete(state);
      expect(nextState).to.deep.equal({
        showConfirmRowDelete: false
      });
    });

    it('should remove rowDeleteError from the main state', () => {
      let state = {
        showConfirmRowDelete: true,
        rowToDelete: {
          id: '1a12c625-de63-44af-88a7-1a59030ec757',
          name: 'bob'
        },
        rowDeleteError: "It's illegal to delete rows from the `rethinkdb.cluster_config` table."
      };
      state = freeze(state);
      const nextState = toggleConfirmRowDelete(state);
      expect(nextState).to.deep.equal({
        showConfirmRowDelete: false
      });
    });
  });

  describe('setRowDeleteError', () => {
    it('should set rowDeleteError to ton the main state', () => {
      let state = {};
      state = freeze(state);
      const rowDeleteError = "It's illegal to delete rows from the `rethinkdb.cluster_config` table."
      const nextState = setRowDeleteError(state, rowDeleteError);
      expect(nextState).to.deep.equal({
        rowDeleteError: "It's illegal to delete rows from the `rethinkdb.cluster_config` table."
      });
    });
  });

  describe('setConnectionError', () => {
    it('adds connection error object to the main app state', () => {
      let state = {};
      state = freeze(state);
      const connectionError = {message:'you have fucked up'};
      let nextState = setConnectionError(state, connectionError);
      expect(nextState).to.deep.equal({
          connectionError: {message:'you have fucked up'}
      })
    });
  });

  describe('setColumnWidths', () => {
    it('adds updated table column widths to state', () => {
      let state = {};
      state = freeze(state);
      const width1 = {id:300};
      const table1 = "logs";
      const database1 = "rethinkdb";
      const width2 = {age:24};
      const table2 = "logs";
      const database2 = "rethinkdb2";
      const width3 = {age:24};
      const table3 = "logs2";
      const database3 = "rethinkdb2";
      const width4 = {name:"sam"};
      const table4 = "logs2";
      const database4 = "rethinkdb2";
      let nextState = setColumnWidths(state, database1, table1, width1);
      nextState = setColumnWidths(nextState, database2, table2, width2);
      nextState = setColumnWidths(nextState, database3, table3, width3);
      nextState = setColumnWidths(nextState, database4, table4, width4);

      expect(nextState).to.deep.equal({
        columnWidths:{
          rethinkdb: {
            logs: {id:300}
          },
          rethinkdb2: {
            logs: {age:24},
            logs2: {age:24, name:"sam"}
          }
        }
      })
    });
  });

});
