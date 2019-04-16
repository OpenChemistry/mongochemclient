import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '@openchemistry/girder-redux';
import { selectors, jupyterlab } from '@openchemistry/redux';
import InstructionsComponent from '../../components/jupyterlab-integration/instructions';

class InstructionsContainer extends Component {
  handleClose = () => {
    const { dispatch } = this.props;
    dispatch(jupyterlab.showJupyterlabIntegration(false));
  }

  render() {
    const { show, apiKey, config } = this.props;

    return (
      <InstructionsComponent apiKey={apiKey} show={show} handleClose={this.handleClose} config={config}/>
    )
  }
}

function mapStateToProps(state, _ownProps) {
  const apiKey = auth.selectors.getApiKey(state);
  const show = selectors.jupyterlab.getShowJupyterlabIntegration(state);
  const config = selectors.configuration.getConfiguration(state);

  return {show, apiKey, config};
}

export default connect(mapStateToProps)(InstructionsContainer);
