import { combineForms } from 'react-redux-form';
import { combineReducers } from 'redux';
import { main } from './main.reducer';
import selectedTable from './data/selected-table.reducer';
import { connections } from './data/connections.reducer';
import { connection } from './data/selectedConnection.reducer';
import { databases } from './data/databases.reducer';
import { tables } from './data/tables.reducer';

const forms = combineForms({
  connection: {}
}, 'forms');

const rootReducer = combineReducers({
  main,
  selectedTable,
  connections,
  connection,
  databases,
  tables,
  forms
});

export default rootReducer;

