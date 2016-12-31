import myModeledReducer from './reducer';
import {modelReducer, formReducer, modeled} from 'react-redux-form';
import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import DevTools from './components/DevTools';
// import freeze from 'redux-freeze';
// reduxMiddleware.push(freeze)

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunk),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);

const reducers = combineReducers({
  // connection: modelReducer('connection'),
  connectionForm: formReducer('connectionForm'),
  databaseForm: formReducer('databaseForm'),
  main: myModeledReducer
});

export default createStore(reducers, {}, enhancer);