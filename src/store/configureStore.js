import { createStore, applyMiddleware } from 'redux'
import reducers from '../redux/reducers'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

export { reducers };

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware()
  return {
    ...createStore(reducers, applyMiddleware(sagaMiddleware, logger)),
    runSaga: sagaMiddleware.run
  }
}
