import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth as authRedux } from '@openchemistry/girder-redux';

import Home from '../components/home/index.js';

class HomeContainer extends Component {
  render() {
    return (
      <Home />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const me = authRedux.selectors.getMe(state);

  return {
    me,
  }
}

HomeContainer = connect(mapStateToProps)(HomeContainer);

export default HomeContainer;