import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import molecules  from './ducks/molecules';
import calculations  from './ducks/calculations';
import users  from './ducks/users';
import girder  from './ducks/girder';
import app  from './ducks/app';
import cumulus  from './ducks/cumulus';
import nersc  from './ducks/nersc';
import jupyterlab from './ducks/jupyterlab';

export default combineReducers({
  molecules,
  calculations,
  users,
  girder,
  app,
  cumulus,
  nersc,
  jupyterlab,
  router: routerReducer,
  form: formReducer
});
