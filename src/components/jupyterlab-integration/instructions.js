import React, { Component } from 'react';
import { isNil } from 'lodash-es'

import {
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@material-ui/core';

import InstructionsDialogComponent from '../instructions-dialog';

class InstructionsComponent extends Component {
  render = () => {
    const {show, handleClose, apiKey, apiUrl, appUrl, config} = this.props;

    const token = {
      appUrl,
      apiUrl,
      apiKey,
    }

    if (!isNil(config)) {
      const {deployment} = config;
      if (!isNil(deployment) && deployment.site.toLowerCase() === 'nersc') {
        token['site'] = 'NERSC';
      }
    }

    console.log("OC_TOKEN", token);

    const token_str = btoa(JSON.stringify(token));

    const commands = [
      `export OC_TOKEN=${token_str}`,
      'pip install openchemistry',
      'jupyter labextension install @openchemistry/jupyterlab',
      'jupyter lab'
    ];

    const command = `${commands.join(' && \\\\\n')}`;

    return (
      <InstructionsDialogComponent
        show={show}
        command={command}
        handleClose={handleClose}
      >
        <DialogTitle>
          Local JupyterLab integration
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Follow the instructions below to use a local version of JupyterLab
            while still keeping the integration with the OpenChemistry server to spawn calculations.
          </DialogContentText>
          <DialogContentText>
            Run the command below
          </DialogContentText>
          <pre style={{whiteSpace: 'pre-wrap'}}>
            {command}
          </pre>
        </DialogContent>
      </InstructionsDialogComponent>
    );
  }
}

export default InstructionsComponent;
