import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectors } from '@openchemistry/redux';

import Home from '../components/home/index.js';

class HomeContainer extends Component {
  render() {
    return (
      <Home />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const me = selectors.girder.getMe(state);

  return {
    me,
  }
}

HomeContainer = connect(mapStateToProps)(HomeContainer);

export default HomeContainer;