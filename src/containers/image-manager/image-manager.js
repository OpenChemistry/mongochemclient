import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageManager from '../../components/image-manager/image-manager';

import { cumulus, images as redux_images, selectors } from '@openchemistry/redux';

class ImageManagerContainer extends Component {

  componentDidMount() {
    this.props.dispatch(redux_images.requestUniqueImages());
  }

  onPull = (imageName, container, clusterId) => {
    const { dispatch } = this.props;
    const taskFlowClass = 'taskflows.ContainerPullTaskFlow';
    dispatch(
      cumulus.launchTaskFlow(imageName, container, clusterId, taskFlowClass)
    );
  };

  render() {
    const { images } = this.props;
    return <ImageManager onPull={this.onPull} images={images} />;
  }
}

function mapStateToProps(state) {
  const images = selectors.images.getUniqueImages(state);
  return { images };
}

export default connect(mapStateToProps)(ImageManagerContainer);
