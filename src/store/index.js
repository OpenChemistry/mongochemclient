import { createStore, applyMiddleware, combineReducers } from 'redux'

import createSagaMiddleware from 'redux-saga'
import {createLogger} from 'redux-logger'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

import { auth } from '@openchemistry/girder-redux';
import { connectRouter } from 'connected-react-router';

import reducers from './reducers';
import rootSaga from './sagas';

export const history = createHistory()

const rootReducer = connectRouter(history)(combineReducers({
  ...reducers,
  auth: auth.reducer
}));

const authSelector = (state) => state.auth;
auth.selectors.setRoot(authSelector);

const middlewares = [];

const reduxRouterMiddleware = routerMiddleware(history)
const sagaMiddleware = createSagaMiddleware();

middlewares.push(sagaMiddleware);
middlewares.push(reduxRouterMiddleware);

if (process.env.NODE_ENV === `development`) {
  // Disable logger in production and make it less obnoxious in development
  middlewares.push(createLogger({
    collapsed: (getState, action) => action.type.startsWith("@@redux-form")
  }));
}

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(...middlewares)
);

sagaMiddleware.run(rootSaga);

export default store;
