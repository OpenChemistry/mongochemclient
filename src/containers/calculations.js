import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { calculations, molecules } from '@openchemistry/redux'

import { isNil } from 'lodash-es';

import Calculations from '../components/calculations';

class CalculationsContainer extends Component {

  componentDidMount() {
    const options = { limit: 25, offset: 0, sort: '_id', sortdir: -1 }
    this.props.dispatch(molecules.loadMolecules(options));
    this.props.dispatch(calculations.loadCalculations(options));
  }

  onOpen = (id) => {
    this.props.dispatch(push(`/calculations/${id}?mo=homo`));
  }

  render() {
    const { calculations, molecules } = this.props;
    if (isNil(calculations)) {
      return null;
    }
    return (
      <Calculations calculations={calculations} molecules={molecules} onOpen={this.onOpen} />
    );
  }
}

CalculationsContainer.propTypes = {
}

CalculationsContainer.defaultProps = {
}

function mapStateToProps(state, ownProps) {
  let calculations = selectors.calculations.getCalculations(state);
  let molecules = selectors.molecules.getMoleculesById(state);
  return { calculations, molecules };
}

export default connect(mapStateToProps)(CalculationsContainer)
