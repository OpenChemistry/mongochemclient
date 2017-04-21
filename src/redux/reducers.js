import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import molecules  from './ducks/molecules';

import app  from './ducks/app';


export default combineReducers({
  molecules,
  app,
  router: routerReducer,
});
