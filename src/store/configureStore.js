import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import createSagaMiddleware from 'redux-saga'
import {createLogger} from 'redux-logger'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

const history = createHistory()
const reduxRouterMiddleware = routerMiddleware(history)

export { reducers };

export default function configureStore() {

  const middlewares = [];

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
      reducers,
      applyMiddleware(...middlewares));

  return {
    ...store,
    runSaga: sagaMiddleware.run,
    history,
  }
}
