import React, { Component } from 'react';

import { MenuItem } from '@material-ui/core';
import BookIcon from '@material-ui/icons/Book';

class JupyterMenuComponent extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <MenuItem onClick={onClick}>
        <BookIcon/> JupyterLab Integration
      </MenuItem>
    );
  }
}

export default JupyterMenuComponent;
