import freeze from 'deep-freeze-node';
import * as types from '../action-types';
import * as selectedTableReducer from './selected-table.reducer';

let RethinkDbService;

describe('Selected Table Reducer', () => {

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

  const defaultSelectedTableState = {
    name: '',
    databaseName: '',
    loading: false,
    view: { current: 'table', prev: null },
    data: [],
    editingRecord: null,
    lastResult: {},
    size: null,
    queryError: null,
    code: {
      body: "{\n  \n}",
      action: 'add',
      error: null
    },
    query: {
      page: 1,
      limit: 5,
      sort: 'id',
      direction: 'asc',
      filterPredicate: '',
      orderByPredicate: ''
    }
  };

  describe('SET_SELECTED_TABLE', () => {
    it('sets initial state', () => {
      const nextState = selectedTableReducer.default(void 0, {});
      expect(nextState).to.deep.equal(defaultSelectedTableState);
    });
    it('sets name, databaseName, and loading to true, while resetting everything else to defaults', () => {
      const state = {
        name: 'someTable',
        databaseName: 'someDB',
        loading: false,
        view: { current: 'table', prev: null },
        data: [{ name: 'Bob' }],
        editingRecord: { name: 'Jim' },
        lastResult: { value: [] },
        size: 50,
        queryError: 'There was an error with your query',
        code: {
          body: "{\n text \n}",
          action: 'add',
          error: 'An Error'
        },
        query: {
          page: 2,
          limit: 25,
          sort: 'name',
          direction: 'desc',
          filterPredicate: '',
          orderByPredicate: ''
        }
      };
      const action = {
        type: types.SET_SELECTED_TABLE,
        tableName: 'myTable',
        databaseName: 'myDB'
      };
      const nextState = selectedTableReducer.default(freeze(state), action);
      const expected = { ...defaultSelectedTableState, name: 'myTable', databaseName: 'myDB', loading: true };
      expect(nextState).to.deep.equal(expected);
    });
  });

  describe('UPDATE_SELECTED_TABLE', () => {
    it('updates data, lastResult, and sets loading to false', () => {
      const state = { ...defaultSelectedTableState, name: 'myTable', databaseName: 'myDB', loading: true };
      const data = ['stuff'];
      const lastResult = {
        profile: [{
          description: "Evaluating slice.",
          'duration(ms)': 51.496578
        }]
      };

      const action = {
        type: types.UPDATE_SELECTED_TABLE,
        data,
        lastResult
      };

      const nextState = selectedTableReducer.default(freeze(state), action);

      expect(nextState).to.deep.equal({
        name: 'myTable',
        databaseName: 'myDB',
        loading: false,
        view: { current: 'table', prev: null },
        data: data,
        editingRecord: null,
        lastResult: lastResult,
        size: null,
        queryError: null,
        code: {
          body: "{\n  \n}",
          action: 'add',
          error: null
        },
        query: {
          page: 1,
          limit: 5,
          sort: 'id',
          direction: 'asc',
          filterPredicate: '',
          orderByPredicate: ''
        }
      });
    });
    it('updates queryError and sets loading to false', () => {
      const state = { ...defaultSelectedTableState, name: 'myTable', databaseName: 'myDB', loading: true };
      const queryError = 'There was an error with your query';

      const action = {
        type: types.UPDATE_SELECTED_TABLE,
        queryError
      };

      const nextState = selectedTableReducer.default(freeze(state), action);

      expect(nextState).to.deep.equal({
        name: 'myTable',
        databaseName: 'myDB',
        loading: false,
        view: { current: 'table', prev: null },
        data: [],
        editingRecord: null,
        lastResult: {},
        size: null,
        queryError: 'There was an error with your query',
        code: {
          body: "{\n  \n}",
          action: 'add',
          error: null
        },
        query: {
          page: 1,
          limit: 5,
          sort: 'id',
          direction: 'asc',
          filterPredicate: '',
          orderByPredicate: ''
        }
      });
    });
  });

  describe('EditingRecord Reducer', () => {
    it('SET_ROW_EDIT updates editingRecord', () => {
      const record = {
        id: 'some-id',
        fieldA: 'some field',
      };
      const action = {
        type: types.SET_ROW_EDIT,
        row: record
      };
      const nextState = selectedTableReducer.editingRecord(null, action);
      expect(nextState).to.deep.equal(record);
    });
    it('SET_ROW_INLINE_EDIT updates editingRecord', () => {
      const record = {
        id: 'some-id',
        fieldA: 'some field',
      };
      const action = {
        type: types.SET_ROW_INLINE_EDIT,
        row: record
      };
      const nextState = selectedTableReducer.editingRecord(null, action);
      expect(nextState).to.deep.equal(record);
    });
    it('SET_ROW_EDIT sets editingRecord to null', () => {
      const state = {
        id: 'some-id',
        fieldA: 'some field',
      };
      const action = {
        type: types.CANCEL_ROW_EDIT
      };
      const nextState = selectedTableReducer.editingRecord(freeze(state), action);
      expect(nextState).to.deep.equal(null);
    });
  });

  describe('Query Reducer', () => {
    const defaultState = {
      limit: 5,
      page: 1,
      sort: 'id',
      direction: 'asc',
      filterPredicate: '',
      orderByPredicate: ''
    };
    it('sets initial state', () => {
      const nextState = selectedTableReducer.query(void 0, {});
      expect(nextState).to.deep.equal(defaultState);
    });
    it('SET_TABLE_PAGE_LIMIT updates the limit', () => {
      const action = {
        type: types.SET_TABLE_PAGE_LIMIT,
        limit: '15'
      };
      const nextState = selectedTableReducer.query(freeze(defaultState), action);
      expect(nextState).to.deep.equal({
        limit: 15,
        page: 1,
        sort: 'id',
        direction: 'asc',
        filterPredicate: '',
        orderByPredicate: ''
      });
    });
    it('SET_TABLE_SORT updates sort, and orderByPredicate if different field', () => {
      const action = {
        type: types.SET_TABLE_SORT,
        field: 'name'
      };
      const nextState = selectedTableReducer.query(freeze(defaultState), action);
      expect(nextState).to.deep.equal({
        limit: 5,
        page: 1,
        sort: 'name',
        direction: 'desc',
        filterPredicate: '',
        orderByPredicate: "r.desc('name')"
      });
    });
    it('SET_TABLE_SORT updates direction and orderByPredicate to desc if same field', () => {
      const action = {
        type: types.SET_TABLE_SORT,
        field: 'id'
      };
      const nextState = selectedTableReducer.query(freeze(defaultState), action);
      expect(nextState).to.deep.equal({
        limit: 5,
        page: 1,
        sort: 'id',
        direction: 'desc',
        filterPredicate: '',
        orderByPredicate: "r.desc('id')"
      });
    });
    it('SET_TABLE_SORT updates direction and orderByPredicate to asc if same field', () => {
      const state = { ...defaultState, direction: 'desc' };
      const action = {
        type: types.SET_TABLE_SORT,
        field: 'id'
      };
      const nextState = selectedTableReducer.query(freeze(state), action);
      expect(nextState).to.deep.equal({
        limit: 5,
        page: 1,
        sort: 'id',
        direction: 'asc',
        filterPredicate: '',
        orderByPredicate: "r.asc('id')"
      });
    });
    it('SET_ORDER_BY_PREDICATE with r command updates orderByPredicate, sort, and direction to desc', () => {
      const action = {
        type: types.SET_ORDER_BY_PREDICATE,
        orderByPredicate: "r.desc('myField')"
      };
      const nextState = selectedTableReducer.query(freeze(defaultState), action);
      expect(nextState).to.deep.equal({
        limit: 5,
        page: 1,
        sort: 'myField',
        direction: 'desc',
        filterPredicate: '',
        orderByPredicate: "r.desc('myField')"
      });
    });
    it('SET_ORDER_BY_PREDICATE with r command updates orderByPredicate, sort, and direction to asc', () => {
      const action = {
        type: types.SET_ORDER_BY_PREDICATE,
        orderByPredicate: "r.asc('myField')"
      };
      const nextState = selectedTableReducer.query(freeze(defaultState), action);
      expect(nextState).to.deep.equal({
        limit: 5,
        page: 1,
        sort: 'myField',
        direction: 'asc',
        filterPredicate: '',
        orderByPredicate: "r.asc('myField')"
      });
    });
    it('SET_ORDER_BY_PREDICATE with string updates orderByPredicate, sort, and direction to asc', () => {
      const action = {
        type: types.SET_ORDER_BY_PREDICATE,
        orderByPredicate: "'myField'"
      };
      const nextState = selectedTableReducer.query(freeze(defaultState), action);
      expect(nextState).to.deep.equal({
        limit: 5,
        page: 1,
        sort: 'myField',
        direction: 'asc',
        filterPredicate: '',
        orderByPredicate: "'myField'"
      });
    });
    it('SET_ORDER_BY_PREDICATE with double string updates orderByPredicate, sort, and direction to asc', () => {
      const action = {
        type: types.SET_ORDER_BY_PREDICATE,
        orderByPredicate: "'myFieldA', 'myFieldB'"
      };
      const nextState = selectedTableReducer.query(freeze(defaultState), action);
      expect(nextState).to.deep.equal({
        limit: 5,
        page: 1,
        sort: 'myFieldA',
        direction: 'asc',
        filterPredicate: '',
        orderByPredicate: "'myFieldA', 'myFieldB'"
      });
    });
    it('SET_FILTER_PREDICATE updates orderByPredicate, sort, and direction', () => {
      const action = {
        type: types.SET_FILTER_PREDICATE,
        filterPredicate: "{name: 'Jim'}"
      };
      const nextState = selectedTableReducer.query(freeze(defaultState), action);
      expect(nextState).to.deep.equal({
        limit: 5,
        page: 1,
        sort: 'id',
        direction: 'asc',
        filterPredicate: "{name: 'Jim'}",
        orderByPredicate: ""
      });
    });
  });

  describe('View Reducer', () => {
    it('sets initial state', () => {
      const expected = {
        current: 'table',
        prev: null
      };
      const nextState = selectedTableReducer.view(void 0, {});
      expect(nextState).to.deep.equal(expected);
    });
    it('TOGGLE_EXPLORER_BODY switches view to tree', () => {
      const state = {
        current: 'table',
        prev: null
      };
      const action = {
        type: types.TOGGLE_EXPLORER_BODY,
        key: 'tree'
      };
      const nextState = selectedTableReducer.view(freeze(state), action);
      expect(nextState).to.deep.equal({
        current: 'tree',
        prev: 'table'
      });
    });
    it('TOGGLE_EXPLORER_BODY switches view to table', () => {
      const state = {
        current: 'tree',
        prev: null
      };
      const action = {
        type: types.TOGGLE_EXPLORER_BODY,
        key: 'table'
      };
      const nextState = selectedTableReducer.view(state, action);
      expect(nextState).to.deep.equal({
        current: 'table',
        prev: 'tree'
      });
    });
    it('TOGGLE_EXPLORER_BODY switches view to code', () => {
      const state = {
        current: 'tree',
        prev: null
      };
      const action = {
        type: types.TOGGLE_EXPLORER_BODY,
        key: 'code'
      };
      const nextState = selectedTableReducer.view(state, action);
      expect(nextState).to.deep.equal({
        current: 'code',
        prev: 'tree'
      });
    });
    it('SET_ROW_EDIT switches view to code', () => {
      const state = {
        current: 'tree',
        prev: null
      };
      const action = {
        type: types.SET_ROW_EDIT
      };
      const nextState = selectedTableReducer.view(state, action);
      expect(nextState).to.deep.equal({
        current: 'code',
        prev: 'tree'
      });
    });
    it('CANCEL_ROW_EDIT switches view to code', () => {
      const state = {
        current: 'code',
        prev: 'tree'
      };
      const action = {
        type: types.CANCEL_ROW_EDIT
      };
      const nextState = selectedTableReducer.view(state, action);
      expect(nextState).to.deep.equal({
        current: 'tree',
        prev: null
      });
    });
  });

  describe('Code Reducer', () => {
    it('sets initial state', () => {
      const expected = {
        action: 'add',
        body: "{\n  \n}",
        error: null,
      };
      const nextState = selectedTableReducer.code(void 0, {});
      expect(nextState).to.deep.equal(expected);
    });
    it('TOGGLE_EXPLORER_BODY resets code state', () => {
      const state = {
        action: 'update',
        body: "{\n name: 'Jim' \n}",
        error: "An Error",
      };
      const expected = {
        action: 'add',
        body: "{\n  \n}",
        error: null,
      };

      let action = {
        type: types.TOGGLE_EXPLORER_BODY,
        key: 'code'
      };
      let nextState = selectedTableReducer.code(freeze(state), action);
      expect(nextState).to.deep.equal(expected);

      action.key = 'table';
      nextState = selectedTableReducer.code(freeze(state), action);
      expect(nextState).to.deep.equal(expected);

      action.key = 'tree';
      nextState = selectedTableReducer.code(freeze(state), action);
      expect(nextState).to.deep.equal(expected);
    });
    it('SET_ROW_EDIT to "code" sets code action to "update" and body to the row data', () => {
      const state = {
        action: 'add',
        body: "{\n text \n}",
        error: "An Error",
      };
      const action = {
        type: types.SET_ROW_EDIT,
        row: { name: 'Jim' }
      };
      const nextState = selectedTableReducer.code(freeze(state), action);
      expect(nextState).to.deep.equal({
        action: 'update',
        body: "{\n  \"name\": \"Jim\"\n}",
        error: null,
      });
    });
    it('SET_ROW_INLINE_EDIT to "code" sets action to "update" and body to the row data', () => {
      const state = {
        action: 'add',
        body: "{\n text \n}",
        error: "An Error",
      };
      const action = {
        type: types.SET_ROW_INLINE_EDIT
      };
      const nextState = selectedTableReducer.code(freeze(state), action);
      expect(nextState).to.deep.equal({
        action: 'update',
        body: "{\n text \n}",
        error: null,
      });
    });
    it('SET_CODE_BODY sets body and preserves action & error', () => {
      const stateAdd = {
        action: 'add',
        body: "{\n text \n}",
        error: "An Error"
      };
      const stateUpdate = {
        action: 'update',
        body: "{\n text \n}",
        error: null
      };
      const action = {
        type: types.SET_CODE_BODY,
        codeBody: "{\n  \"name\": \"Jim\"\n}"
      };
      let nextState = selectedTableReducer.code(freeze(stateAdd), action);
      expect(nextState).to.deep.equal({
        action: 'add',
        body: "{\n  \"name\": \"Jim\"\n}",
        error: 'An Error'
      });

      nextState = selectedTableReducer.code(freeze(stateUpdate), action);
      expect(nextState).to.deep.equal({
        action: 'update',
        body: "{\n  \"name\": \"Jim\"\n}",
        error: null
      });
    });
    it('SET_CODE_BODY_ERROR sets error and preserves action & body', () => {
      const state = {
        action: 'add',
        body: "{\n text \n}",
        error: null
      };
      const action = {
        type: types.SET_CODE_BODY_ERROR,
        codeBodyError: 'An Error'
      };
      const nextState = selectedTableReducer.code(freeze(state), action);
      expect(nextState).to.deep.equal({
        action: 'add',
        body: "{\n text \n}",
        error: 'An Error'
      });
    });
  });

});
