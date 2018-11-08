import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { reducers as ocReducers } from '@openchemistry/redux';

const reducers = {
  molecules: ocReducers.molecules,
  calculations: ocReducers.calculations,
  girder: ocReducers.girder,
  app: ocReducers.app,
  cumulus: ocReducers.cumulus,
  jupyterlab: ocReducers.jupyterlab,
  router: routerReducer,
  form: formReducer
};

export default reducers;
