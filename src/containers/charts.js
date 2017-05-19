import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import VibrationalModesChart from '../components/charts'
import selectors from '../redux/selectors'

export default class VibrationalModesChartContainer extends Component {

  render() {
    return <VibrationalModesChart data={this.props.data}/>;
  }
}

VibrationalModesChartContainer.propTypes = {
  data: PropTypes.object,
}

VibrationalModesChartContainer.defaultProps = {
  data: null
}
