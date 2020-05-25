import React, { Component } from 'react';

import { MenuItem } from '@material-ui/core';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

class ImageManagerMenuComponent extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <MenuItem onClick={onClick}>
        <LibraryBooksIcon /> Manage Images
      </MenuItem>
    );
  }
}

export default ImageManagerMenuComponent;
