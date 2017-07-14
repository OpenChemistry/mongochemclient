import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import molecules  from './ducks/molecules';
import calculations  from './ducks/calculations';
import users  from './ducks/users';
import girder  from './ducks/girder';
import app  from './ducks/app';
import cumulus  from './ducks/cumulus';


export default combineReducers({
  molecules,
  calculations,
  users,
  girder,
  app,
  cumulus,
  router: routerReducer,
});
