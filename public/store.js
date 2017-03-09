import rootReducer from './reducer';
import {modelReducer, formReducer, modeled} from 'react-redux-form';
import {createStore, applyMiddleware, compose} from 'redux';
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

export default createStore(rootReducer, {}, enhancer);
