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
