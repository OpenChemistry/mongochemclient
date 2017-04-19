import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './index.css';
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import { Provider } from 'react-redux';

const store = configureStore()
store.runSaga(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
