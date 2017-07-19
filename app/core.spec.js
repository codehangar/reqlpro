import jdenticon from 'jdenticon';
import md5 from 'md5';
import freeze from 'deep-freeze-node';
import * as core from './core';

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

  describe('setState', () => {
    it('merges provided state with current state', () => {
      const originalState = { a: 1, b:2 };
      const newState = { b:5, c:0 };
      let nextState = core.setState(originalState, newState);
      expect(nextState).to.deep.equal({
        a: 1,
        b: 5,
        c: 0
      });
    });
  });

  describe('setEmail', () => {
    it('adds email and created to redux store', () => {
      const state = {};
      const email = 'cassie@codehangar.io';
      const created = 'new date'
      let nextState = core.setEmail(state, email, created);
      expect(nextState).to.deep.equal({
        email: 'cassie@codehangar.io',
        created: 'new date'
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

      const nextState = core.hideOpenMenus(state, statePropsToUpdate);

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

      const nextState = core.hideOpenMenus(state);

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

      const nextState = core.toggleDatabaseForm(state, true);

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

      const nextState = core.toggleDatabaseForm(state, false);

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

      const nextState = core.toggleDeleteDatabaseForm(state, true, 'test');

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

      const nextState = core.toggleDeleteDatabaseForm(state, false);

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

      const nextState = core.toggleDeleteTableForm(state, true, {database: 'database'}, 'test');

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

      const nextState = core.toggleDeleteTableForm(state, false);

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

      const nextState = core.toggleTableForm(state, true);

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

      const nextState = core.toggleTableForm(state, false);

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
      const nextState = core.setDbToEdit(state, database);
      expect(nextState).to.deep.equal({
        dbToEdit: {
          name: 'ReQL'
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
      const nextState = core.toggleConfirmRowDelete(state, rowToDelete);
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
      const nextState = core.toggleConfirmRowDelete(state);
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
      const nextState = core.toggleConfirmRowDelete(state);
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
      const nextState = core.setRowDeleteError(state, rowDeleteError);
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
      let nextState = core.setConnectionError(state, connectionError);
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
      let nextState = core.setColumnWidths(state, database1, table1, width1);
      nextState = core.setColumnWidths(nextState, database2, table2, width2);
      nextState = core.setColumnWidths(nextState, database3, table3, width3);
      nextState = core.setColumnWidths(nextState, database4, table4, width4);

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
