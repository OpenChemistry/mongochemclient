import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { reducers } from '@openchemistry/redux';

export default combineReducers({
  molecules: reducers.molecules,
  calculations: reducers.calculations,
  users: reducers.users,
  girder: reducers.girder,
  app: reducers.app,
  cumulus: reducers.cumulus,
  nersc: reducers.nersc,
  jupyterlab: reducers.jupyterlab,
  router: routerReducer,
  form: formReducer
});
