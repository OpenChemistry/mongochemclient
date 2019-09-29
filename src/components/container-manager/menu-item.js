import React, { Component } from 'react';

import { MenuItem } from '@material-ui/core';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

class ContainerManagerMenuComponent extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <MenuItem onClick={onClick}>
        <LibraryBooksIcon /> Manage Containers
      </MenuItem>
    );
  }
}

export default ContainerManagerMenuComponent;
