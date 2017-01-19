import { combineForms } from 'react-redux-form';
import {combineReducers} from 'redux';
import { main } from './main.reducer';
import { connection } from './connection.reducer';

// const initialUser = {name:''};
const cForm = combineForms({
  connectionForm: connection,
})

const rootReducer = combineReducers({
  // connection: modelReducer('connection'),
  // connectionForm: formReducer('connectionForm'),
  // databaseForm: formReducer('databaseForm'),
  main,
  connection,
  cForm
});

export default rootReducer;

