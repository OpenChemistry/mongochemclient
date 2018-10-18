import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Route } from 'react-router'
import Cookies from 'universal-cookie';
import { isNil } from 'lodash-es'
import { girder } from '@openchemistry/redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import CssBaseline from '@material-ui/core/CssBaseline';
import teal from '@material-ui/core/colors/teal';
import pink from '@material-ui/core/colors/pink';

import App from './App';


import configureStore from './store/configureStore'
import rootSaga from '@openchemistry/sagas'

// Webcomponents
import { defineCustomElements as defineMolecule } from '@openchemistry/molecule/dist/loader';

defineMolecule(window);

const store = configureStore()
store.runSaga(rootSaga)


const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400]
    },
    secondary: pink,
  },
  pageHead: {
    paddingTop: 4,
    paddingBottom: 14
  },
  pageBody: {
    marginTop: -13
  },
  pageContent: {
    width: 150,
    paddingLeft: 3,
    paddingRight: 3
  },
  drawer: {
    width: 240,
    backgroundColor: '#37474F'
  }
});

class PrivateRoute extends Component {

  render() {

    const { component, token, isAuthenticating, isAuthenticated,
            providers,  ...rest } = this.props;

    if (!isAuthenticated && !isAuthenticating) {
      store.dispatch(girder.authenticate(token));
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

// Check to see if we have a cookie
const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');
if (!isNil(cookieToken)) {
  store.dispatch(girder.authenticate(cookieToken));
}

store.dispatch(girder.testOauthEnabled())

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <App/>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
