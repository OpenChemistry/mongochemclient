import React, {Component} from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch } from 'react-router'

import MoleculeContainer from './containers/molecule';
import CalculationContainer from './containers/calculation';
import {VibrationalModesChartContainer, FreeEnergyChartContainer} from './containers/charts';

import { auth as authUI, route } from '@openchemistry/girder-ui';

// @material-ui components
import { withStyles } from '@material-ui/core/styles'; // v1.x

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import NotebookContainer from './containers/notebook';
import NotebooksContainer from './containers/notebooks';
import SideBar from './containers/sidebar';
import Footer from './containers/footer';
import Home from './containers/home';
import Molecules from './containers/molecules';
import Calculations from './containers/calculations';
import Header from './containers/header';
import JupyterIntegration from './containers/jupyterlab-integration/instructions';
import Groups from './containers/administrator/group-manager';
import Members from './containers/administrator/member-manager';

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
  contentContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flexGrow:1
  },
  footer: {
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
            <div className={classes.contentContainer}>
              <div className={classes.content}>

                <Switch>
                  <route.Public exact path='/' component={Home}/>
                  <route.Public exact path='/molecules/:id' component={MoleculeContainer}/>
                  <route.Public exact path='/molecules/inchikey/:inchikey' component={MoleculeContainer}/>
                  <route.Public exact path='/molecules' component={Molecules}/>
                  <route.Public exact path='/chart' component={VibrationalModesChartContainer}/>
                  <route.Public exact path='/freechart' component={FreeEnergyChartContainer}/>
                  <route.Public path='/calculations/:id/orbital/:iOrbital' component={CalculationContainer}/>
                  <route.Public path='/calculations/:id' component={CalculationContainer}/>
                  <route.Public path='/calculations' component={Calculations}/>
                  <route.Public path='/notebooks/:id' component={NotebookContainer}/>
                  <route.Public path='/notebooks' component={NotebooksContainer} />
                  <route.Private path='/groups/:id/members' component={Members} />
                  <route.Private path='/groups' component={Groups} />
                </Switch>

                <authUI.LoginOptions girder={development}/>
                <authUI.GirderLogin/>
                <authUI.NerscLogin/>
                <authUI.OauthRedirect/>
                <JupyterIntegration/>
              </div>
              <div className={classes.footer}>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </ConnectedRouter>
    );
  }
}

export default withStyles(appStyles)(App);
