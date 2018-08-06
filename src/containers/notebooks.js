import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import Notebooks from '../components/notebooks'

import { app } from '@openchemistry/redux'
import { selectors } from '@openchemistry/redux'

class NotebooksContainer extends Component {

  componentDidMount() {
    this.props.dispatch(app.loadNotebooks());
  }

  render() {
    return <Notebooks notebooks={this.props.notebooks} />;
  }
}

NotebooksContainer.propTypes = {
  notebooks: PropTypes.array,
}

NotebooksContainer.defaultProps = {
  notebooks: []
}

function mapStateToProps(state, ownProps) {
  const notebooks = selectors.app.getNotebooks(state);

  return {
    notebooks
  };
}

export default connect(mapStateToProps)(NotebooksContainer)
