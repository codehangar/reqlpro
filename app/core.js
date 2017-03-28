import update from 'immutability-helper';

export function setState(state, newState) {
  return Object.assign({}, state, newState);
}

export function setEmail(state, email, created) {
  if (email) {
    return Object.assign({}, state, {
      email,
      created
    });
  }
  return state;
}

export function setDbConnection(state, dbConnection) {
  // console.log('<3<3<3 setDbConnection dbConnection', dbConnection);
  return Object.assign({}, state, {
    dbConnection
  });
};

export function hideOpenMenus(state, propsToSet) {

  //if props passed in, return new state with these props set to false
  if (propsToSet) {
    let updatedProps = {};
    propsToSet.forEach(
      (prop) => {
        if (state[prop]) {
          updatedProps[prop] = false;
        }
      }
    )
    return Object.assign({}, state, updatedProps)
  }
  //if no props passed in return current state
  return state;
};

export function toggleDatabaseForm(state, showDatabaseForm) {
  return Object.assign({}, state, {
    showDatabaseForm
  });
};

export function toggleDeleteDatabaseForm(state, showDeleteDatabaseForm, dbToDelete) {
  // state.showDeleteDatabaseForm = showDeleteDatabaseForm;
  // if (dbToDelete) state.dbToDelete = dbToDelete;
  let newState = Object.assign({}, state, { showDeleteDatabaseForm });
  if (dbToDelete) newState.dbToDelete = dbToDelete;
  return newState;
  // return state;
}

export function toggleTableForm(state, showTableForm) {
  return Object.assign({}, state, {
    showTableForm
  });
}

export function toggleDeleteTableForm(state, showDeleteTableForm, database, tableToDelete) {
  // state.showDeleteDatabaseForm = showDeleteDatabaseForm;
  // if (dbToDelete) state.dbToDelete = dbToDelete;
  let newState = Object.assign({}, state, { showDeleteTableForm });
  if (tableToDelete) newState.tableToDelete = tableToDelete;
  if (database) newState.selectedDatabase = database;
  return newState;
  // return state;
}

export function setDbToEdit(state, database) {
  let newState = Object.assign({}, state, {
    dbToEdit: database
  });
  return newState;
}

export function setSelectedTable(state, databaseName, tableName) {
  let selectedTable = {
    databaseName: databaseName,
    name: tableName,
    // Todo: maintain type from previous selectedTable
    type: 'table',
    data: [],
    loading: true,
    codeBody: "{\n  \n}",
    codeAction: 'add',
    codeBodyError: null,
    // Todo: maintain query from previous selectedTable
    query: {
      limit: 5,
      page: 1,
      sort: 'id',
      direction: 'asc'
    }
  };
  let newState = Object.assign({}, state, { selectedTable });
  return newState;
}

export function removeSelectedTable(state) {
  return Object.assign({}, state, { selectedTable: void 0 });
}

export function updateSelectedTable(state, data, lastResult, queryError = null) {
  let newSelectedTable = Object.assign({}, state.selectedTable, { data, lastResult, queryError });
  newSelectedTable.loading = false;
  let newState = Object.assign({}, state, { selectedTable: newSelectedTable })
  return newState;
}


export function setTableQuery(state, query) {
  const selectedTable = Object.assign({}, state.selectedTable, { query });
  return Object.assign({}, state, { selectedTable });
}

export function updateSelectedTablePageLimit(state, limit) {
  let queryCopy = Object.assign({}, state.selectedTable.query)
  queryCopy.limit = parseInt(limit);
  let newSelectedTable = Object.assign({}, state.selectedTable, { query: queryCopy });
  return Object.assign({}, state, { selectedTable: newSelectedTable });
}

export function updateSelectedTableSort(state, sort) {
  let queryCopy = Object.assign({}, state.selectedTable.query)
  queryCopy.sort = sort;
  queryCopy.direction = queryCopy.direction === 1 ? 0 : 1;
  let newSelectedTable = Object.assign({}, state.selectedTable, { query: queryCopy });
  return Object.assign({}, state, { selectedTable: newSelectedTable });
}

export function setSelectedTableSize(state, size) {
  let selectedTable = Object.assign({}, state.selectedTable, { size });
  return Object.assign({}, state, { selectedTable });
}

export function setFilterPredicate(state, filterPredicate) {
  const query = Object.assign({}, state.selectedTable.query, { filterPredicate });
  const selectedTable = Object.assign({}, state.selectedTable, { query });
  return Object.assign({}, state, { selectedTable });
}

export function setOrderByPredicate(state, orderByPredicate) {
  const preds = orderByPredicate.split(',');
  const pieces = preds[0].match(/[^'"]+(?=['"])/g);
  const sort = pieces ? pieces[pieces.length - 1] : '';
  const direction = orderByPredicate.indexOf('desc') !== -1 ? 'desc' : 'asc';
  const query = Object.assign({}, state.selectedTable.query, { orderByPredicate, sort, direction });
  const selectedTable = Object.assign({}, state.selectedTable, { query });
  return Object.assign({}, state, { selectedTable });
}

export function startRowEdit(state, record) {
  const newFields = {
    codeAction: 'update',
    editingRecord: record,
    codeBody: JSON.stringify(record, null, '  '),
    codeBodyError: null,
    previousType: state.selectedTable.type,
    type: 'code',
  };
  const newSelectedTable = Object.assign({}, state.selectedTable, newFields);
  return Object.assign({}, state, { selectedTable: newSelectedTable });
}

export function startRowInlineEdit(state, editingRecord) {
  const newFields = {
    codeAction: 'update',
    editingRecord,
    codeBodyError: null
  };
  const selectedTable = Object.assign({}, state.selectedTable, newFields);
  return Object.assign({}, state, { selectedTable });
}

export function cancelRowEdit(state) {
  const newFields = {
    codeAction: 'add',
    editingRecord: null,
    codeBody: "{\n  \n}",
    codeBodyError: null,
    previousType: null,
    type: state.selectedTable.previousType,
  };
  const newSelectedTable = Object.assign({}, state.selectedTable, newFields);
  return Object.assign({}, state, { selectedTable: newSelectedTable });
}

export function toggleExplorerBody(state, type) {
  const newFields = {
    previousType: state.selectedTable.type,
    type: type
  };
  if (type === 'code') {
    newFields.codeAction = 'add';
    newFields.codeBody = "{\n  \n}";
    newFields.codeBodyError = null;
  }
  const newSelectedTable = Object.assign({}, state.selectedTable, newFields);
  return Object.assign({}, state, { selectedTable: newSelectedTable });
}

export function setCodeBodyError(state, codeBodyError) {
  const selectedTable = Object.assign({}, state.selectedTable, { codeBodyError });
  const newState = Object.assign({}, state, { selectedTable });
  return newState;
}

export function setCodeBody(state, codeBody) {
  const selectedTable = Object.assign({}, state.selectedTable, { codeBody });
  const newState = Object.assign({}, state, { selectedTable });
  return newState;
}

export function setLastDbResult(state, lastResult) {
  const selectedTable = Object.assign({}, state.selectedTable, { lastResult });
  const newState = Object.assign({}, state, { selectedTable });
  return newState;
}

export function toggleConfirmRowDelete(state, rowToDelete) {
  let newState = Object.assign({}, state);
  delete newState.rowDeleteError;
  if (rowToDelete) {
    newState.showConfirmRowDelete = true;
    newState = Object.assign({}, newState, { rowToDelete });
  } else {
    newState.showConfirmRowDelete = false;
    delete newState.rowToDelete;
  }
  return newState;
}

export function setRowDeleteError(state, rowDeleteError) {
  return Object.assign({}, state, { rowDeleteError })
}
export function setConnectionError(state, connectionError) {
  return Object.assign({}, state, { connectionError })
}
export function setColumnWidths(state, database, table, width) {
  let newColumnWidth = {};
  let columnWidthsCopy;

  if (state.columnWidths) {
    columnWidthsCopy = Object.assign({}, state.columnWidths);
    if (!columnWidthsCopy[database]) {
      let obj = {};
      obj[table] = width;
      columnWidthsCopy[database] = obj;
    }
    {
      if (!columnWidthsCopy[database][table]) {
        columnWidthsCopy[database][table] = width;
      } else {
        columnWidthsCopy[database][table][Object.keys(width)[0]] = width[Object.keys(width)[0]]
      }
    }
  } else {
    newColumnWidth[database] = {};
    newColumnWidth[database][table] = width;
    columnWidthsCopy = newColumnWidth;
  }

  return Object.assign({}, state, { columnWidths: columnWidthsCopy })
}

export function setAddTableError(state, error) {
  return Object.assign({}, state, { addTableError: error });
}

export function setDeleteDatabaseConfirmError(state, deleteDatabaseConfirmError) {
  return Object.assign({}, state, { deleteDatabaseConfirmError });
}

export function setDeleteTableConfirmError(state, deleteTableConfirmError) {
  return Object.assign({}, state, { deleteTableConfirmError })
}

export function setTableFormError(state, tableFormError) {
  return Object.assign({}, state, { tableFormError });
}

export function setDatabaseFormError(state, databaseFormError) {
  return Object.assign({}, state, { databaseFormError });
}