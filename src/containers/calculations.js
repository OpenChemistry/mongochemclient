import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { calculations } from '@openchemistry/redux'

import { isNil } from 'lodash-es';

import Calculations from '../components/calculations';

class CalculationsContainer extends Component {

  componentDidMount() {
    this.props.dispatch(calculations.loadCalculations());
  }

  onOpen = (id) => {
    this.props.dispatch(push(`/calculations/${id}`));
  }

  render() {
    const { calculations } = this.props;
    if (isNil(calculations)) {
      return null;
    }
    return (
      <Calculations calculations={calculations} onOpen={this.onOpen} />
    );
  }
}

CalculationsContainer.propTypes = {
}

CalculationsContainer.defaultProps = {
}

function mapStateToProps(state, ownProps) {
  let calculations = selectors.calculations.getCalculations(state);
  return { calculations };
}

export default connect(mapStateToProps)(CalculationsContainer)
