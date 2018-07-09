import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'
import Cookies from 'universal-cookie';
import { isNil } from 'lodash-es'

import App from './components/app';
import MoleculeContainer from './containers/molecule';
import CalculationContainer from './containers/calculation';
import {VibrationalModesChartContainer, FreeEnergyChartContainer} from './containers/charts';
import './index.css';
import logo from './OpenChemistry_Logo.svg';
import { selectors } from '@openchemistry/redux';
import {authenticate, testOauthEnabled} from '@openchemistry/redux'
import {selectAuthProvider, showNerscLogin, showGirderLogin} from '@openchemistry/redux'

import configureStore from './store/configureStore'
import rootSaga from '@openchemistry/sagas'

// @material-ui components
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputIcon from '@material-ui/icons/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Can't use react-redirect anymore with react > 15.5
// import ReactRedirect from 'react-redirect'

import google from './google.svg'
import nersc from './nerscnim.png'
import girderLogo from './girder.png'
import NerscLogin from './components/nersc'
import GirderLogin from './components/girder-login'
import LoginMenu from './components/loginmenu'
import NotebookContainer from './containers/notebook'

const store = configureStore()
store.runSaga(rootSaga)

// Needed for onClick
// http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin();

// const style = {
//   backgroundColor: '#FAFAFA',
// }

const theme = createMuiTheme();

class PrivateRoute extends Component {

  render() {

    const { component, token, isAuthenticating, isAuthenticated,
            providers,  ...rest } = this.props;

    if (!isAuthenticated && !isAuthenticating) {
      store.dispatch(authenticate(token));
    }

    const render = (props) => {
      if (isAuthenticated) {
        return React.createElement(component, props)
      }

      if (providers && providers.Google) {
        return (//<ReactRedirect location={providers.Google}>
                <div>
                  Redirecting...
                </div>
               //</ReactRedirect>
              )
      }

      return <div>Authenticating...</div>
    }

    return <Route {...rest} render={render}/>
  }
}

PrivateRoute.propTypes = {
    token: PropTypes.string,
    isAuthenticating: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    providers: PropTypes.object
  }

PrivateRoute.defaultProps = {
  token: null,
  isAuthenticating: false,
  isAuthenticated: false,
  providers: null
}

//function mapStateToProps(state, ownProps) {
//  const token = selectors.girder.getToken(state);
//  const isAuthenticating = selectors.girder.isAuthenticating(state);
//  const isAuthenticated = selectors.girder.isAuthenticated(state);
//  const providers = selectors.girder.getOauthProviders(state);
//
//  return {
//    token,
//    isAuthenticating,
//    isAuthenticated,
//    providers,
//  }
//}

//PrivateRoute = connect(mapStateToProps)(PrivateRoute)

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

    this.props.dispatch(selectAuthProvider(true));
  };
}

function loginMapStateToProps(state, ownProps) {
  const token = selectors.girder.getToken(state);

  return {
    token,
  }
}

Login = connect(loginMapStateToProps)(Login)

class Header extends Component {
  render = () => {
    return (
        <AppBar color="inherit" position="fixed">
          <Toolbar>
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
      return (
          null //  <ReactRedirect location={providers.Google}/>
      );
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
    this.props.dispatch(selectAuthProvider(false))
  };

  handleGoogle = () => {
    this.props.dispatch(selectAuthProvider(false))
    this.props.dispatch(authenticate(this.props.token))
  }

  handleNersc = () => {
    this.props.dispatch(selectAuthProvider(false));
    this.props.dispatch(showNerscLogin(true));
  }

  handleGirder = () => {
    this.props.dispatch(selectAuthProvider(false));
    this.props.dispatch(showGirderLogin(true));
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

SelectLoginProvider = connect(selectLoginProviderMapStateToProps)(SelectLoginProvider)

// Check to see if we have a cookie
const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');
if (!isNil(cookieToken)) {
  store.dispatch(authenticate(cookieToken));
}

store.dispatch(testOauthEnabled())

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={store.history}>
        <div>
        <Header/>
          <div style={{marginTop: 65}}>
            <Route exact path='/' component={App}/>
            <Route exact path='/molecules/:id' component={MoleculeContainer}/>
            <Route exact path='/molecules/inchikey/:inchikey' component={MoleculeContainer}/>
            <Route exact path='/chart' component={VibrationalModesChartContainer}/>
            <Route exact path='/freechart' component={FreeEnergyChartContainer}/>
            <Route path='/calculations/:id' component={CalculationContainer}/>
            <Route path='/notebooks/:id' component={NotebookContainer}/>
          </div>
        <OauthRedirect/>
        <SelectLoginProvider/>
        <NerscLogin/>
        <GirderLogin/>
        </div>
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
