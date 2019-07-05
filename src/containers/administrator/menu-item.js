import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import AdminMenuComponent from '../../components/administrator/menu-item';

class AdminMenuContainer extends Component {
  onClick = () => {
    this.props.dispatch(push('/administrator'));
  }

  render() {

    return (
      <AdminMenuComponent onClick={this.onClick}></AdminMenuComponent>
    );
  }
}

function mapStateToProps(state, _ownProps) {
}

export default connect(mapStateToProps)(AdminMenuContainer);
