import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import ContainerManagerMenuComponent from '../../components/container-manager/menu-item';

class ContainerManagerMenuContainer extends Component {
  onClick = () => {
    this.props.dispatch(push('/containers'));
  };

  render() {
    return (
      <ContainerManagerMenuComponent
        onClick={this.onClick}
      ></ContainerManagerMenuComponent>
    );
  }
}

function mapStateToProps(state, _ownProps) {
  return {};
}

export default connect(mapStateToProps)(ContainerManagerMenuContainer);
