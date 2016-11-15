import myModeledReducer from './reducer';
import { modelReducer, formReducer, modeled } from 'react-redux-form';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

export default createStore(combineReducers({
  // connection: modelReducer('connection'),
  connectionForm: formReducer('main'),
  main: myModeledReducer
}), applyMiddleware(thunk));