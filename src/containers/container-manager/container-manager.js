import React, { Component } from 'react';
import { connect } from 'react-redux';

import ContainerManager from '../../components/container-manager/container-manager';

class ContainerManagerContainer extends Component {
  render() {
    return <ContainerManager />;
  }
}

function mapStateToProps(state) {}

export default connect(mapStateToProps)(ContainerManagerContainer);
