import _ from 'lodash';

export function getColumnNames(tableData) {

  let columnNames = [];
  _.forEach(tableData, function(row) {
    columnNames = columnNames.concat(Object.keys(row));
  });
  columnNames = _.uniq(columnNames);

  // Sort columns alphabetically, with id always coming first
  columnNames.sort(function(a, b) {
    if (a === 'id') {
      return -1;
    } else if (b === 'id') {
      return 1;
    } else if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  });

  return columnNames;
}

export function getColumnWidth(columnWidths = {}, table, fieldName) {
    if (columnWidths[table.databaseName] && columnWidths[table.databaseName][table.name] && columnWidths[table.databaseName][table.name][fieldName]) {
      return columnWidths[table.databaseName][table.name][fieldName];
    } else if (fieldName === 'id') {
      return 274;
    } else {
      return 200;
    }
}
