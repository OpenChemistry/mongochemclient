import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import ImageManagerMenuComponent from '../../components/image-manager/menu-item';

class ImageManagerMenuContainer extends Component {
  onClick = () => {
    this.props.dispatch(push('/images'));
  };

  render() {
    return (
      <ImageManagerMenuComponent
        onClick={this.onClick}
      ></ImageManagerMenuComponent>
    );
  }
}

function mapStateToProps(state, _ownProps) {
  return {};
}

export default connect(mapStateToProps)(ImageManagerMenuContainer);
