import React, {Component} from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router'

import MoleculeContainer from './containers/molecule';
import CalculationContainer from './containers/calculation';
import {VibrationalModesChartContainer, FreeEnergyChartContainer} from './containers/charts';

import { auth as authUI } from '@openchemistry/girder-ui';

// @material-ui components
import { withStyles } from '@material-ui/core/styles'; // v1.x

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import NotebookContainer from './containers/notebook';
import NotebooksContainer from './containers/notebooks';
import SideBar from './containers/sidebar';
import Home from './containers/home';
import Molecules from './containers/molecules';
import Calculations from './containers/calculations';
import Header from './containers/header';
import JupyterIntegration from './containers/jupyterlab-integration/instructions';

import { history } from './store';

const appStyles = theme => ({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawerPaper: {
    position: 'relative',
    width: theme.drawer.width,
    backgroundColor: theme.drawer.backgroundColor,
  },
  body: {
    display: 'flex',
    flexGrow: 1
  },
  content: {
    flexGrow: 1
  }
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSideBar: false
    }
  }

  toggleSideBar = () => {
    this.setState({...this.state, openSideBar: !this.state.openSideBar});
  }

  render() {
    const {classes} = this.props;
    let development = false;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ||
        process.env.REACT_APP_DEPLOYMENT === 'development') {
      development = true;
    }

    return (
      <ConnectedRouter history={history}>
        <div className={classes.root}>
          <Header onToggleMenu={this.toggleSideBar}/>
          <div className={classes.body}>
            {/* Desktop side menu */}
            <Hidden smDown>
              <Drawer
                variant='persistent'
                open
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <SideBar />
              </Drawer>
            </Hidden>

            {/* Mobile side menu */}
            <Hidden mdUp>
              <Drawer
                variant='temporary'
                anchor={'left'}
                open={this.state.openSideBar}
                onClose={this.toggleSideBar}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                <SideBar onLinkClick={this.toggleSideBar} />
              </Drawer>
            </Hidden>
            <div className={classes.content}>

              <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/molecules/:id' component={MoleculeContainer}/>
                <Route exact path='/molecules/inchikey/:inchikey' component={MoleculeContainer}/>
                <Route exact path='/molecules' component={Molecules}/>
                <Route exact path='/chart' component={VibrationalModesChartContainer}/>
                <Route exact path='/freechart' component={FreeEnergyChartContainer}/>
                <Route path='/calculations/:id/orbital/:iOrbital' component={CalculationContainer}/>
                <Route path='/calculations/:id' component={CalculationContainer}/>
                <Route path='/calculations' component={Calculations}/>
                <Route path='/notebooks/:id' component={NotebookContainer}/>
                <Route path='/notebooks' component={NotebooksContainer} />
              </Switch>

              <authUI.LoginOptions girder={development}/>
              <authUI.GirderLogin/>
              <authUI.NerscLogin/>
              <authUI.OauthRedirect/>
              <JupyterIntegration/>
            </div>
          </div>
        </div>
      </ConnectedRouter>
    );
  }
}

export default withStyles(appStyles)(App);
