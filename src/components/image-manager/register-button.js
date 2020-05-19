import React, { Component } from 'react';

import { Button, Tooltip, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex'
  }
});


class RegisterButton extends Component {
  render() {
    const { props } = this;
    return (
      <Tooltip title="Automatically find and register images">
        <Button
          onClick={props.onClick}
          className={props.className}
          variant={props.variant}
        >
          {props.children}
        </Button>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(RegisterButton);
