import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'
import Cookies from 'universal-cookie';
import App from './components/app';
import MoleculeContainer from './containers/molecule';
import CalculationContainer from './containers/calculation';
import {VibrationalModesChartContainer, FreeEnergyChartContainer} from './containers/charts';
import './index.css';
import logo from './OpenChemistry_Logo.svg';
import selectors from './redux/selectors';
import {authenticate, invalidateToken, loadMe} from './redux/ducks/girder'
import {selectAuthProvider, showNerscLogin} from './redux/ducks/app'

import configureStore from './store/configureStore'
import rootSaga from './sagas'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import ActionInput from 'material-ui/svg-icons/action/input';
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactRedirect from 'react-redirect'
require('font-awesome/css/font-awesome.css');
import google from './google.svg'
import nersc from './nerscnim.png'
import NerscLogin from './components/nersc'

const store = configureStore()
store.runSaga(rootSaga)

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const style = {
  backgroundColor: '#FAFAFA',
}

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
        return (<ReactRedirect location={providers.Google}>
                <div>
                  Redirecting...
                  </div>
               </ReactRedirect>)
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
        <FlatButton icon={<ActionInput/>}
                    onTouchTap={this.handleTouchTap}
                    label='Log in'
                    labelPosition='before' />
    );
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.props.dispatch(selectAuthProvider(true))
  };
}

function loginMapStateToProps(state, ownProps) {
  const token = selectors.girder.getToken(state);

  return {
    token,
  }
}

Login = connect(loginMapStateToProps)(Login)

class LoginMenu extends Component {
  render = () => {
    const {me} = this.props;

    return (
        <IconMenu
          iconButtonElement={
            <FlatButton
             label={me ? me.login : '' }
             labelPosition='before'
             icon={<NavigationArrowDropDown />} />
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText='Sign out' leftIcon={<ActionExitToApp/>}
                    onTouchTap={this.handleTouchTap}  />
      </IconMenu>
    );
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.props.dispatch(invalidateToken())
  };
}

function loginMenuMapStateToProps(state, ownProps) {
  const me = selectors.girder.getMe(state);

  return {
    me,
  }
}


LoginMenu = connect(loginMenuMapStateToProps)(LoginMenu)

class Header extends Component {
  render = () => {
    return (
        <AppBar style={style} iconElementLeft={<img className='oc-logo' src={logo} alt="logo" />}
          iconElementRight={!this.props.isAuthenticated ? <Login/> : <LoginMenu/>} />
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
    const providers = this.props.providers;
    if (providers && providers.Google) {
      return (
           <ReactRedirect location={providers.Google}/>
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

  return {
    providers,
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


  render = () => {

  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose}
    />]

    return (
      <Dialog
        title="Select a login providers"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
      <FlatButton icon={<img className='oc-google' src={google} alt="google" />}
        onTouchTap={this.handleGoogle}
        label='Sign in with Google'
        labelPosition='after' />
      <FlatButton style={{'margin-left': '30px'}} icon={<img className='oc-nersc' src={nersc} alt="nim" />}
        onTouchTap={this.handleNersc}
        label='Sign in with NIM'
          labelPosition='after' />
      </Dialog>
    );

  }
}

function selectLoginProviderMapStateToProps(state, ownProps) {
  const open = selectors.app.selectAuthProvider(state);

  return {
    open,
  }
}

SelectLoginProvider = connect(selectLoginProviderMapStateToProps)(SelectLoginProvider)

// Check to see if we have a cookie
const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');
store.dispatch(authenticate(cookieToken));
// Not sure we need this
store.dispatch(loadMe());
ReactDOM.render(
  <MuiThemeProvider >
    <Provider store={store}>
      <ConnectedRouter history={store.history}>
        <div>
         <Header />
          <div>
            <Route exact path='/' component={App}/>
            <Route exact path='/molecules/:id' component={MoleculeContainer}/>
            <Route exact path='/molecules/inchikey/:inchikey' component={MoleculeContainer}/>
            <Route exact path='/chart' component={VibrationalModesChartContainer}/>
            <Route exact path='/freechart' component={FreeEnergyChartContainer}/>
            <Route path='/calculations/:id' component={CalculationContainer}/>
          </div>
         <OauthRedirect/>
         <SelectLoginProvider/>
         <NerscLogin/>
        </div>
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
