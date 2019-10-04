import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageManager from '../../components/image-manager/image-manager';

import { cumulus } from '@openchemistry/redux';

class ImageManagerContainer extends Component {
  onPull = (imageName, container, clusterId) => {
    const { dispatch } = this.props;
    const taskFlowClass = 'taskflows.ContainerPullTaskFlow';
    dispatch(
      cumulus.launchTaskFlow(imageName, container, clusterId, taskFlowClass)
    );
  };

  render() {
    return <ImageManager onPull={this.onPull} />;
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ImageManagerContainer);
