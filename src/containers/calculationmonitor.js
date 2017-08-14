import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadTaskFlow } from '../redux/ducks/cumulus';
import CalculationMonitorTable from '../components/calculationmonitor';
import selectors from '../redux/selectors';
import { CalculationState } from '../utils/constants'
import _ from 'lodash';

class CalculationMonitorTableContainer extends Component {

  componentDidMount() {
    if (this.props.taskFlowIds != null) {
      for (const id of this.props.taskFlowIds) {
        this.props.dispatch(loadTaskFlow({id}));
      }
    }
  }

  isComplete() {
    let states = this.props.calculations.map((calculation) => calculation.status);
    states = _.uniq(states)

    return (states.length === 1) && (states[0] === CalculationState.complete.name);
  }

  render() {

    const props = {
      calculations: this.props.calculations,
    }

    if (this.isComplete() && !_.isNil(this.props.completeTitle)) {
      props['title'] = this.props.completeTitle;
    }

    return <CalculationMonitorTable {...props} />;
  }
}

CalculationMonitorTableContainer.propTypes = {
    taskFlowIds: PropTypes.array,
    completeTitle: PropTypes.string,
}

CalculationMonitorTableContainer.defaultProps = {
    taskFlowIds: [],
    completeTitle: '',
}

function mapStateToProps(state, ownProps) {

  const calculations = []
  for (const taskFlowId of ownProps.taskFlowIds) {
    const calculation = {
        name: taskFlowId,
        status: selectors.cumulus.getCalculationStatus(state, taskFlowId)
    }
    calculations.push(calculation);
  }

  return {
    calculations,
  }
}

export default connect(mapStateToProps)(CalculationMonitorTableContainer)

