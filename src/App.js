import React, {Component} from 'react';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router'
import PropTypes from 'prop-types';

import MoleculeContainer from './containers/molecule';
import CalculationContainer from './containers/calculation';
import {VibrationalModesChartContainer, FreeEnergyChartContainer} from './containers/charts';
import './index.css';
import logo from './OpenChemistry_Logo.svg';
import { selectors } from '@openchemistry/redux';
import { girder } from '@openchemistry/redux';
import { app } from '@openchemistry/redux';

// @material-ui components
import { withStyles } from '@material-ui/core/styles'; // v1.x

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import google from './google.svg'
import nersc from './nerscnim.png'
import girderLogo from './girder.png'
import NerscLogin from './components/nersc'
import GirderLogin from './components/girder-login'
import LoginMenu from './components/loginmenu'
import NotebookContainer from './containers/notebook';
import NotebooksContainer from './containers/notebooks';
import SideBar from './containers/sidebar';
import Home from './containers/home';
import Molecules from './containers/molecules';
import Calculations from './containers/calculations';

import { history } from './store/configureStore';

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
              {/* <div className="content-wrapper"> */}
                  <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/molecules/:id' component={MoleculeContainer}/>
                    <Route exact path='/molecules/inchikey/:inchikey' component={MoleculeContainer}/>
                    <Route exact path='/molecules' component={Molecules}/>
                    <Route exact path='/chart' component={VibrationalModesChartContainer}/>
                    <Route exact path='/freechart' component={FreeEnergyChartContainer}/>
                    <Route path='/calculations/:id' component={CalculationContainer}/>
                    <Route path='/calculations' component={Calculations}/>
                    <Route path='/notebooks/:id' component={NotebookContainer}/>
                    <Route path='/notebooks' component={NotebooksContainer} />
                  </Switch>
                {/* </div> */}
                <div className="footer-container">
                  {/* <Footer /> */}
                </div>
              
            
          <OauthRedirect/>
          <SelectLoginProvider/>
          <NerscLogin/>
          <GirderLogin/>
          </div>
        </div>
        </div>
      </ConnectedRouter>
    );
  }
}

export default withStyles(appStyles)(App);

class Login extends Component {
  render = () => {
    return (
        <Button onClick={this.handleTouchTap}>
          Log in
          <InputIcon className="r-icon-btn" />
        </Button>
    );
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.props.dispatch(app.selectAuthProvider(true));
  };
}

function loginMapStateToProps(state, ownProps) {
  const token = selectors.girder.getToken(state);

  return {
    token,
  }
}

Login = connect(loginMapStateToProps)(Login)

const appBarStyles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    // position: 'absolute',
    // marginLeft: drawerWidth,
    // [theme.breakpoints.up('md')]: {
    //   width: `calc(100% - ${drawerWidth}px)`,
    // },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class Header extends Component {
  render = () => {
    const {classes, onToggleMenu} = this.props;
    return (
        <AppBar color="inherit" position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={onToggleMenu}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Button color="inherit" aria-label="Logo" style={{marginRight: 9}}>
              <img className='oc-logo' src={logo} alt="logo" />
            </Button>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
            </Typography>
            {!this.props.isAuthenticated ? <Login/> : <LoginMenu/>}
          </Toolbar>
        </AppBar>
    );
  }
}

Header = withStyles(appBarStyles)(Header);


function headerMapStateToProps(state, ownProps) {
  const isAuthenticated = selectors.girder.isAuthenticated(state);

  return {
    isAuthenticated,
  }
}

Header = connect(headerMapStateToProps)(Header)

class OauthRedirect extends Component {
  render = () => {
    const {providers, isAuthenticating} = this.props;
    if (isAuthenticating && providers && providers.Google) {
      window.location = providers.Google;
    } else {
      return (null);
    }
  }
}

OauthRedirect.propTypes = {
    providers: PropTypes.object,
  }

OauthRedirect.defaultProps = {
  providers: {}
}

function redirectMapStateToProps(state, ownProps) {
  const providers = selectors.girder.getOauthProviders(state);
  const isAuthenticating = selectors.girder.isAuthenticating(state);
  return {
    providers,
    isAuthenticating,
  }
}

OauthRedirect = connect(redirectMapStateToProps)(OauthRedirect)

class SelectLoginProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const {open} = nextProps;
    this.setState({
      open
    });
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
    this.props.dispatch(app.selectAuthProvider(false))
  };

  handleGoogle = () => {
    this.props.dispatch(app.selectAuthProvider(false))
    this.props.dispatch(girder.authenticate(this.props.token))
  }

  handleNersc = () => {
    this.props.dispatch(app.selectAuthProvider(false));
    this.props.dispatch(app.showNerscLogin(true));
  }

  handleGirder = () => {
    this.props.dispatch(app.selectAuthProvider(false));
    this.props.dispatch(app.showGirderLogin(true));
  }


  render = () => {

    const actions = [
      <Button key="cancel" color="primary" onClick={this.handleClose}>
        Cancel
      </Button>
    ]

    return (
      <Dialog
        aria-labelledby="login-dialog-title"
        open={this.state.open}
        onClose={this.handleClose}
      >
        <DialogTitle id="login-dialog-title">Login Provider</DialogTitle>
          <List>
          { this.props.oauth &&
            <ListItem button onClick={this.handleGoogle}>
              <ListItemText primary="Sign in with Google" />
              <ListItemIcon>
                <img className='oc-google' src={google} alt="google" />
              </ListItemIcon>
            </ListItem>
          }
          { !this.props.oauth &&
            <ListItem button onClick={this.handleNersc}>
              <ListItemText primary="Sign in with NIM" />
              <ListItemIcon>
                <img className='oc-nersc' src={nersc} alt="nim" />
              </ListItemIcon>
            </ListItem>
          }
            <ListItem button onClick={this.handleGirder}>
              <ListItemText primary="Sign in with Girder" />
              <ListItemIcon>
                <img className='oc-girder' src={girderLogo} alt="girder" />
              </ListItemIcon>
            </ListItem>
          </List>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    );

  }
}

function selectLoginProviderMapStateToProps(state, ownProps) {
  const open = selectors.app.selectAuthProvider(state);
  const oauth =  selectors.girder.isOauthEnabled(state);

  return {
    open,
    oauth,
  }
}

SelectLoginProvider = connect(selectLoginProviderMapStateToProps)(SelectLoginProvider);
