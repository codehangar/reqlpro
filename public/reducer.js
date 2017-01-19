import { combineForms } from 'react-redux-form';
import { combineReducers } from 'redux';
import { main } from './main.reducer';
import { connections } from './components/Sidebar/Connections/connections.reducer';
import { connection } from './components/Sidebar/Connections/selectedConnection.reducer';
import { databases } from './components/Sidebar/Databases/databases.reducer';
import { tables } from './components/Sidebar/Databases/Database/DbTables/tables.reducer';

const forms = combineForms({
  connection: {}
}, 'forms');

const rootReducer = combineReducers({
  main,
  connections,
  connection,
  databases,
  tables,
  forms
});

export default rootReducer;

