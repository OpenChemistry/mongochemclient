import React, { Component } from 'react';
import { connect } from 'react-redux';

import ContainerManager from '../../components/container-manager/container-manager';

import { cumulus } from '@openchemistry/redux';

class ContainerManagerContainer extends Component {
  onPull = (imageName, container, clusterId) => {
    const { dispatch } = this.props;
    const taskFlowClass = 'taskflows.ContainerPullTaskFlow';
    dispatch(
      cumulus.launchTaskFlow(imageName, container, clusterId, taskFlowClass)
    );
  };

  render() {
    return <ContainerManager onPull={this.onPull} />;
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ContainerManagerContainer);
