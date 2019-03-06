import React, { Component } from 'react';

import {
  Button,
  Dialog,
  DialogActions
} from '@material-ui/core';

class InstructionsDialogComponent extends Component {

  handleCopy = (event, text) => {
    const dummyEl = document.createElement('textarea');
    dummyEl.value = text;
    event.target.appendChild(dummyEl);
    dummyEl.select();
    document.execCommand('copy');
    event.target.removeChild(dummyEl);
  }

  render() {
    const {command, children, show, handleClose} = this.props;

    return (
      <Dialog
        open={show}
        onClose={handleClose}
        scroll='paper'
      >
        {children}
        <DialogActions>
          <Button color="secondary"
            onClick={(e) => {this.handleCopy(e, command)}}
          >
            Copy command
          </Button>
          <Button color="primary" onClick={handleClose}>
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default InstructionsDialogComponent;
