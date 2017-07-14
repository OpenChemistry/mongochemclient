import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TaskFlowMonitor extends Component {
  render() {
    return (
      <div>{this.props.status} </div>
    );
  }

}

TaskFlowMonitor.propTypes = {
  status: PropTypes.string,
}

TaskFlowMonitor.defaultProps = {
  status: null,
}

export default TaskFlowMonitor
