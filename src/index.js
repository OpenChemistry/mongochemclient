import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'
import App from './components/app';
import MoleculeContainer from './containers/molecule';
import {VibrationalModesChartContainer, FreeEnergyChartContainer} from './containers/charts';
import './index.css';
import configureStore from './store/configureStore'
import rootSaga from './sagas'

const store = configureStore()
store.runSaga(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={store.history}>
      <div>
        <Route exact path='/' component={App}/>
        <Route exact path='/molecules/:id' component={MoleculeContainer}/>
        <Route exact path='/molecules/inchikey/:inchikey' component={MoleculeContainer}/>
        <Route exact path='/chart' component={VibrationalModesChartContainer}/>
        <Route exact path='/freechart' component={FreeEnergyChartContainer}/>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
