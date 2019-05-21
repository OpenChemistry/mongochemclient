import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { molecules } from '@openchemistry/redux'

import { isNil } from 'lodash-es';

import Molecules from '../components/molecules';

class MoleculesContainer extends Component {

  componentDidMount() {
    var options = { limit: 25, offset: 0, sort: '_id', sortdir: -1 }
    this.props.dispatch(molecules.loadMolecules(options));
  }

  onOpen = (inchikey) => {
    this.props.dispatch(push(`/molecules/inchikey/${inchikey}`));
  }

  render() {
    const { molecules } = this.props;
    if (isNil(molecules)) {
      return null;
    }
    return (
      <Molecules molecules={molecules} onOpen={this.onOpen} />
    );
  }
}

MoleculesContainer.propTypes = {
}

MoleculesContainer.defaultProps = {
}

function mapStateToProps(state, ownProps) {
  let molecules = selectors.molecules.getMolecules(state);
  return { molecules };
}

export default connect(mapStateToProps)(MoleculesContainer)
