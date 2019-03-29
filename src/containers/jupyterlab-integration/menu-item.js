import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash-es';

import { auth } from '@openchemistry/girder-redux';
import { jupyterlab } from '@openchemistry/redux';

import JupyterMenuComponent from '../../components/jupyterlab-integration/menu-item';

class JupyterMenuContainer extends Component {
  onClick = () => {
    const { me, apiKey, dispatch } = this.props;
    if (!isNil(me) && isNil(apiKey)) {
      dispatch(auth.actions.loadApiKey({name: 'oc_jupyterlab'}));
    }
    dispatch(jupyterlab.showJupyterlabIntegration(true));
  }

  render() {

    return (
      <JupyterMenuComponent onClick={this.onClick}></JupyterMenuComponent>
    );
  }
}

function mapStateToProps(state, _ownProps) {
  const apiKey = auth.selectors.getApiKey(state);
  const me = auth.selectors.getMe(state);
  return {me, apiKey};
}

export default connect(mapStateToProps)(JupyterMenuContainer);
