import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadTaskFlowStatus } from '../redux/ducks/cumulus'
import TaskFlowMonitor from '../components/taskflow'
import selectors from '../redux/selectors'

class TaskFlowMonitorContainer extends Component {

  componentDidMount() {
    //if (this.props.id != null) {
      this.props.dispatch(loadTaskFlowStatus({
        id: '59690550f6571016e5500a73'
      }));
    //}
  }

  render() {
    return <TaskFlowMonitor status={this.props.status} />;
  }
}

TaskFlowMonitorContainer.propTypes = {
  id: PropTypes.string,

}

TaskFlowMonitorContainer.defaultProps = {
  id: null
}

function mapStateToProps(state, ownProps) {
  let status = selectors.cumulus.getTaskFlowStatus(state, '59690550f6571016e5500a73');

  return {
    status,
  }
}

export default connect(mapStateToProps)(TaskFlowMonitorContainer)
