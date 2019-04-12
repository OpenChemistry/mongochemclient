import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash-es'

import girderClient from '@openchemistry/girder-client';
import {
  selectors
} from '@openchemistry/redux';

import FooterComponent from '../../components/footer';

class FooterContainer extends Component {
  render() {
    return (<FooterComponent {...this.props}></FooterComponent>);
  }
}

function mapStateToProps(state, _ownProps) {
  const { configuration } = selectors.configuration.getConfiguration(state) || {};
  let props = {};

  if (!isNil(configuration)) {
    const { privacy, license, footerLogoFileId, footerLogoUrl } = configuration;
    let footerLogoImageUrl = null;
    if (!isNil(footerLogoFileId)) {
      const baseUrl = girderClient().getBaseURL();
      footerLogoImageUrl = `${baseUrl}/file/${footerLogoFileId}/download`
    }
    props = { privacy, license, footerLogoImageUrl, footerLogoUrl };
  }

  return props;
}

export default connect(mapStateToProps)(FooterContainer);
