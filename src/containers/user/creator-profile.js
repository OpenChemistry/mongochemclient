import React, { Component } from 'react';
import { connect } from 'react-redux';

import CreatorProfile from '../../components/user/creator-profile';

import { calculations, molecules, selectors } from '@openchemistry/redux';

class CreatorContainer extends Component {

  componentDidMount() {
    const { location, dispatch } = this.props;
    const { type, id } = location.state;
    if (type === 'calculation') {
      dispatch(calculations.loadCalculationById(id))
    } else {
      dispatch(molecules.loadMoleculeById(id))
    }
  }

  render() {
    return (
      <CreatorProfile
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const userInfo = selectors.calculations.getCalculationCreator(state);
  let twitterId = userInfo.twitterId;
  let orcidId = userInfo.orcidId;

  if (!twitterId) {
    twitterId = undefined
  }
  if (!orcidId) {
    orcidId = undefined
  }
  const mediaIds = {twitterId, orcidId}

  return {
    userInfo,
    mediaIds
  };
}

CreatorContainer = connect(mapStateToProps)(CreatorContainer)

export default CreatorContainer;
