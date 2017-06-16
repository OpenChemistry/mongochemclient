import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import molecules  from './ducks/molecules';
import calculations  from './ducks/calculations';

import app  from './ducks/app';


export default combineReducers({
  molecules,
  calculations,
  app,
  router: routerReducer,
});
