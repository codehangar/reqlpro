import jdenticon from 'jdenticon';
import md5 from 'md5';
// import RethinkDbService from '../main/services/rethinkdb.service';

export function setState(state, newState) {
  return Object.assign({}, state, newState);
}

export function setConnections(state, connections) {
  return Object.assign({}, state, {
    main: {connections}
  });
}

export function setEmail(state, email) {
  if (email) {
    return Object.assign({}, state, {
      email
    });
  }
  return state;
}

export function showConnectionForm(state, mode, selectedConnection) {
  switch (mode) {
    case 'NEW':
      let newState = Object.assign({}, state, {
        showAddConnectionForm: true
      })
      if (state.showEditConnectionForm) {
        delete newState.showEditConnectionForm;
      }
      if (state.selectedConnection) {
        delete newState.selectedConnection;
      }
      return newState;
    case 'EDIT':
      // console.log('EDIT', mode)
      let newState2 = Object.assign({}, state, {
        showEditConnectionForm: true,
        selectedConnection: selectedConnection
      })
      if (state.showAddConnectionForm) {
        delete newState2.showAddConnectionForm;
      }
      return newState2;
  }

  return state;
}

export function hideConnectionForm(state) {
  let newState = Object.assign({}, state)
  if (state.showEditConnectionForm) {
    delete newState.showEditConnectionForm;
  }
  if (state.showAddConnectionForm) {
    delete newState.showAddConnectionForm;
  }
  return newState;
}

export function addConnection(state, connection) {
  let connections = [];
  if (state.connections) {
    connections = state.connections.slice();
  }
  let newConnection;
  if (connection) {
    newConnection = {
      name: connection.name,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      authKey: "",
      identicon: jdenticon.toSvg(md5(connection.name), 40),
      index: state.connections ? state.connections.length : 0
    }
    connections.push(newConnection);
    //TODO: Auto-connect to DB
  }

  const selectedConnectionState = setConnection(state, newConnection)

  return Object.assign({}, state, selectedConnectionState, {connections});
}

export function updateConnection(state, connection){
  // console.log('core updateConnection', connection);
  const connectionsCopy = state.connections.slice(0);
  connectionsCopy.forEach( (c, i) => {
    if (c.index === connection.index){
      connectionsCopy[i] = connection
    }
  })

  const newState = Object.assign({}, state, {connections: connectionsCopy})
  return newState;
}

export function deleteConnection(state, id){
  //copy state
  let newState = Object.assign({}, state);
  //copy connections
  const connectionsCopy = state.connections.slice(0);
  
  //remove connection with appropriate id from connections copy
  connectionsCopy.forEach( (c, i) => {
    if (c.index === id){
      connectionsCopy.splice(i, 1);
    }
  })

  //remove or set new selectedConnection
  if(state.selectedConnection && connectionsCopy.length == 0){
    newState.selectedConnection = Object.assign({}, state.selectedConnection);
    delete newState.selectedConnection;
  }else if(state.selectedConnection){
    newState = setConnection(newState, connectionsCopy[0]);
  }

  newState = Object.assign({}, newState, {connections: connectionsCopy})
  return newState;
}

export function setConnection(state, selectedConnection) {
  return Object.assign({}, state, {
    selectedConnection
  });
};

export function setDbConnection(state, dbConnection) {
  // console.log('<3<3<3 setDbConnection dbConnection', dbConnection);
  return Object.assign({}, state, {
    dbConnection
  });
};

export function setDbList(state, databases) {
  const selectedConnectionCopy = Object.assign({}, state.selectedConnection, {databases})
  return Object.assign({}, state, {selectedConnection: selectedConnectionCopy});
};

export function setDbTables(state, databaseName, tables) {

  let newDatabase, index;
  for (var i = 0; i < state.selectedConnection.databases.length; i++) {
    const database = state.selectedConnection.databases[i];
    if (database.name === databaseName) {
      index = i;
       newDatabase = Object.assign({}, state.selectedConnection.databases[i], {tables})
    };
  }

  const head = state.selectedConnection.databases.slice(0, index)
  const tail = state.selectedConnection.databases.slice(index+1)
  const databases = head.concat([newDatabase]).concat(tail);

  const selectedConnectionCopy = Object.assign({}, state.selectedConnection, {databases});

  return Object.assign({}, state, {selectedConnection: selectedConnectionCopy});
};

export function hideOpenMenus(state, propsToSet) {

  //if props passed in, return new state with these props set to false
  if(propsToSet){
    let updatedProps = {};
    propsToSet.forEach(
      (prop) => {
        if(state[prop]){
          updatedProps[prop] = false;
        }
      }
    )
    return Object.assign({}, state, updatedProps)
  }
  //if no props passed in return current state
  return state;
};

export function toggleDatabaseForm (state, showDatabaseForm) {
  return Object.assign({}, state, {showDatabaseForm});
};

export function toggleTableForm (state, showTableForm) {
  return Object.assign({}, state, {showTableForm});
};

export function addDatabase (state, database) {

  let newState = Object.assign({}, state);
  let databasesCopy;
  
  if(state.selectedConnection.databases)
    databasesCopy = state.selectedConnection.databases.slice(0);

  if(!databasesCopy){
    databasesCopy = [database];
  }else{
    databasesCopy.push(database);
  }

  newState.selectedConnection.databases = databasesCopy;

  console.log('addDatabase newState', newState);

  return newState;
};
