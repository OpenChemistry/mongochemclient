import React, { Component } from 'react';

import { MenuItem } from '@material-ui/core';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

class AdminMenuComponent extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <MenuItem onClick={onClick}>
        <SupervisedUserCircleIcon/> Manage Groups
      </MenuItem>
    );
  }
}

export default AdminMenuComponent;
