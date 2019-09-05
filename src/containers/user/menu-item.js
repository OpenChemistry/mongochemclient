import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import UserMenuComponent from '../../components/user/menu-item';

class UserMenuContainer extends Component {
  onClick = () => {
    this.props.dispatch(push('/user'));
  }

  render() {

    return (
      <UserMenuComponent onClick={this.onClick} />
    );
  }
}

function mapStateToProps() {
}

export default connect(mapStateToProps)(UserMenuContainer);
