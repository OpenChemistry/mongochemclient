import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import SideBar from '../../components/sidebar';
import { auth } from '@openchemistry/girder-redux';
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
    const { showNotebooks, userId } = this.props;
    return (
      <SideBar pushRoute={this.pushRoute} showNotebooks={showNotebooks} userId={userId}/>
    );
  }
}

const mapStateToProps = (state, ownProps) => {

  const config = selectors.configuration.getConfiguration(state);
  const user = auth.selectors.getMe(state);
  const props = {}

  if (!_.isNil(config)) {
    props.showNotebooks = config.features.notebooks;
  }
  if (!_.isNil(user)) {
    props.userId = user._id;
  }

  return props;
}

SideBarContainter = connect(mapStateToProps)(SideBarContainter);

export default SideBarContainter;
