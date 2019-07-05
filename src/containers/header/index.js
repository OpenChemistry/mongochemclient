import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import Header from '../../components/header/';

import { auth } from '@openchemistry/girder-redux';
import { admin } from '@openchemistry/girder-redux';

class HeaderContainer extends Component {
  
  onLogoClick = () => {
    this.props.dispatch(push('/'));
  }

  render() {
    return (
      <Header
        {...this.props}
        onLogoClick={this.onLogoClick}
        loggedIn={this.props.loggedIn}
        user={this.props.user}
      />
    );
  }
}

function mapStateToProps(state) {
  const loggedIn = auth.selectors.isAuthenticated(state);
  const user = auth.selectors.getMe(state);
  return {
    loggedIn,
    user
  }
}

export default connect(mapStateToProps)(HeaderContainer);
