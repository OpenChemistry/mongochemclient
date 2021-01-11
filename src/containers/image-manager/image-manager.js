import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageManager from '../../components/image-manager/image-manager';

import { cumulus, images as redux_images, selectors } from '@openchemistry/redux';

class ImageManagerContainer extends Component {

  componentDidMount() {
    this.props.dispatch(redux_images.requestUniqueImages());
  }

  imageType = () => {
    // FIXME: this should be set by some internal setting
    return 'Docker';
  };

  onPull = (imageName, clusterId) => {
    const { dispatch } = this.props;
    const container = this.imageType().toLowerCase();
    const taskFlowClass = 'taskflows.ContainerPullTaskFlow';
    dispatch(
      cumulus.launchTaskFlow(imageName, container, clusterId, taskFlowClass)
    );
  };

  onRegister = () => {
    this.props.dispatch(redux_images.registerImages());
  };

  render() {
    const { images } = this.props;
    return <ImageManager
              onPull={this.onPull}
              onRegister={this.onRegister}
              images={images} />;
  }
}

function mapStateToProps(state) {
  const images = selectors.images.getUniqueImages(state);
  return { images };
}

export default connect(mapStateToProps)(ImageManagerContainer);
