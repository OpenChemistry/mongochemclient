import React, { Component } from 'react';

import { AppBar, Toolbar, Button } from '@material-ui/core';
import { auth as authUI} from '@openchemistry/girder-ui';

import JupyterMenu from '../../containers/jupyterlab-integration/menu-item';
import logo from '../../OpenChemistry_Logo.svg';
import './index.css';

class Header extends Component {
  render() {
    const { loggedIn, onLogoClick } = this.props;
    return (
      <AppBar color="default" position="static">
        <Toolbar>
          <Button color="inherit" aria-label="Logo" style={{marginRight: 9}}
            onClick={onLogoClick}
          >
            <img className='logo' src={logo} alt="logo" />
          </Button>
          <div style={{flex: 1}}>
          </div>
          { loggedIn
          ? <authUI.UserMenu>
              <JupyterMenu/>
            </authUI.UserMenu>
          : <authUI.LoginButton />
          }
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
