import { createStore, applyMiddleware } from 'redux'
import reducers from '../redux/reducers'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

const history = createHistory()
const reduxRouterMiddleware = routerMiddleware(history)

export { reducers };

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
      reducers,
      applyMiddleware(sagaMiddleware, logger, reduxRouterMiddleware));

  return {
    ...store,
    runSaga: sagaMiddleware.run,
    history,
  }
}
