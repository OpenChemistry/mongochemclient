import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import SideBar from '../../components/sidebar';
import {
  selectors
} from '@openchemistry/redux';
import _ from 'lodash-es';

class SideBarContainter extends Component {

  pushRoute = (route) => {
    this.props.dispatch(push(route))
    if (this.props.onLinkClick) {
      // Callback to close the sidebar
      this.props.onLinkClick();
    }
  };

  render() {
    const { showNotebooks } = this.props;
    return (
      <SideBar pushRoute={this.pushRoute} showNotebooks={showNotebooks} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {

  const config = selectors.configuration.getConfiguration(state);
  const props = {}

  if (!_.isNil(config)) {
    props.showNotebooks = config.features.notebooks;
  }

  return props;
}

SideBarContainter = connect(mapStateToProps)(SideBarContainter);

export default SideBarContainter;
