describe('Explorer Table View Utils', () => {
  let explorerTableViewUtils;
  let Segment, actions;

  beforeEach(function() {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    // Mock the rethinkdb service
    Segment = sinon.stub();
    Segment.track = sinon.stub();
    mockery.registerMock('../../../../../services/segment.service', Segment);

    actions = sinon.stub();
    mockery.registerMock('../../../../../actions', actions);

    explorerTableViewUtils = require('./explorer-table-view-utils');
    console.log('explorerTableViewUtils', explorerTableViewUtils);
  });

  describe('getColumnNames', () => {
    it('should return a sorted array of column names', () => {
      const tableData = [
        {
          "id": "d18d43e7-5a40-4a2c-a02a-7e43aa57a6c0",
          "age": 17
        }, {
          "id": "b3eb4d54-32ea-4923-9a03-eb82e285467a",
          "name": "noooo"
        }, {
          "id": "b16ae6b6-dc82-451f-ba10-6032462cca0b",
          "name": "yaass"
        }, {
          "id": "a9a95024-97bd-4372-913d-9944ad8d260e",
          "price": "999.99"
        }, {
          "id": "a17113b6-e137-4fb7-8bd3-3983e10f53a6",
          "address": "Neverland"
        }
      ];

      let nextState = explorerTableViewUtils.getColumnNames(tableData);
      expect(nextState).to.deep.equal([
        'id', 'address', 'age', 'name', 'price'
      ]);
    });
  });

  describe('getColumnNames', () => {
    it('should return proper column widths', () => {
      const columnWidths = {
        myDb: {
          myTable: {
            name: 350,
            age: 400
          }
        }
      };
      const table = {
        databaseName: 'myDb',
        name: 'myTable'
      };

      let width = explorerTableViewUtils.getColumnWidth(columnWidths, table, 'id');
      expect(width).to.equal(274);

      width = explorerTableViewUtils.getColumnWidth(columnWidths, table, 'age');
      expect(width).to.equal(400);

      width = explorerTableViewUtils.getColumnWidth(columnWidths, table, 'name');
      expect(width).to.equal(350);

      width = explorerTableViewUtils.getColumnWidth(columnWidths, table, 'price');
      expect(width).to.equal(200);

      width = explorerTableViewUtils.getColumnWidth(columnWidths, table, 'address');
      expect(width).to.equal(200);
    });
  });

});