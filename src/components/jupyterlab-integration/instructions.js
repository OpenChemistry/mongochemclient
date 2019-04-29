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
    const {show, handleClose, apiKey, config} = this.props;
    const { protocol, hostname, origin, port } = window.location;

    const commands = [
      `export GIRDER_API_KEY=${apiKey}`,
      `export GIRDER_SCHEME=${protocol.split(':')[0]}`,
      `export GIRDER_HOST=${hostname}`
    ]
    if (!isNil(port) && port.trim() !== '') {
      commands.push(`export GIRDER_PORT=${port}`);
    }

    if (!isNil(config)) {
      const {deployment} = config;
      if (!isNil(deployment) && deployment.site.toLowerCase() === 'nersc') {
        commands.push(`export OC_SITE=NERSC`);
      }
    }

    commands.push(`export APP_BASE_URL=${origin}`);
    commands.push('pip install openchemistry');
    commands.push('jupyter labextension install @openchemistry/jupyterlab')
    commands.push('jupyter lab');

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
