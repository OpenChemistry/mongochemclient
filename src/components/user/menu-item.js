import React, { Component } from 'react';
import { MenuItem } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

class UserMenuComponent extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <MenuItem onClick={onClick}>
        <AccountCircleIcon/> User Profile
      </MenuItem>
    );
  }
}

export default UserMenuComponent;
