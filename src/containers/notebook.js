import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import Notebook from '../components/notebook'

class NotebookContainer extends Component {

  render() {
    return <Notebook fileId={this.props.fileId} />
  }
}

NotebookContainer.propTypes = {
  fileId: PropTypes.string,
}

NotebookContainer.defaultProps = {
  fileId: null
}

function mapStateToProps(state, ownProps) {
  let fileId = ownProps.match.params.id || null;

  return {
    fileId
  };
}

export default connect(mapStateToProps)(NotebookContainer)
