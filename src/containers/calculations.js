import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { calculations, molecules } from '@openchemistry/redux'

import { isNil } from 'lodash-es';

import Calculations from '../components/calculations';

class CalculationsContainer extends Component {

  componentDidMount() {
    this.props.dispatch(molecules.loadMolecules());
    this.props.dispatch(calculations.loadCalculations());
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
