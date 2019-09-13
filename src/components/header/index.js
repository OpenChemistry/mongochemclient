import React, { Component } from 'react';

import { AppBar, Toolbar, Button, withStyles, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import { auth as authUI} from '@openchemistry/girder-ui';

import AdminMenu from '../../containers/administrator/menu-item';
import JupyterMenu from '../../containers/jupyterlab-integration/menu-item';
import logo from '../../OpenChemistry_Logo.svg';
import UserMenu from '../../containers/user/menu-item'

import { isNil, has } from 'lodash-es';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  logo: {
    height: theme.spacing.unit * 5
  }
});

class Header extends Component {
  render() {
    const { loggedIn, onLogoClick, onToggleMenu, classes, user } = this.props;
    return (
      <AppBar color="default" position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={onToggleMenu}
            className={classes.navIconHide}
          >
            <MenuIcon />
          </IconButton>
          <Button color="inherit" aria-label="Logo" style={{marginRight: 9}}
            onClick={onLogoClick}
          >
            <img className={classes.logo} src={logo} alt="logo" />
          </Button>
          <div style={{flex: 1}}>
          </div>
          { loggedIn
          ? <authUI.UserMenu>
              <JupyterMenu/>
              <UserMenu/>
              { !isNil(user) && user.admin
              ? <AdminMenu/>
              : null
              }
            </authUI.UserMenu>
          : <authUI.LoginButton />
          }
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
