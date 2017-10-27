import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {VibrationalModesChart, FreeEnergyChart} from '../components/charts'

export class VibrationalModesChartContainer extends Component {

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

export class FreeEnergyChartContainer extends Component {

  render() {
    return <FreeEnergyChart data={this.props.data}/>;
  }
}

FreeEnergyChartContainer.propTypes = {
  data: PropTypes.object,
}

FreeEnergyChartContainer.defaultProps = {
  data: null
}
