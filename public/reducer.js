import { combineForms, formReducer, modelReducer } from 'react-redux-form';
import { combineReducers } from 'redux';
import { main } from './main.reducer';
import { connections } from './components/Sidebar/Connections/connections.reducer';
import { connection } from './components/Sidebar/Connections/selectedConnection.reducer';

const forms = combineForms({
  // lol: {},
  connection: {}
}, 'forms');

const rootReducer = combineReducers({
  main,
  connections,
  connection,
  forms
});

export default rootReducer;

