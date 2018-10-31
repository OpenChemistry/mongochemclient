import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { jupyterlab } from '@openchemistry/redux';

import Notebooks from '../components/notebooks'

import { app } from '@openchemistry/redux'
import { selectors } from '@openchemistry/redux'

class NotebooksContainer extends Component {

  onOpen = (notebook) =>  {
    const name = notebook.name
    this.props.dispatch(jupyterlab.redirectToJupyterHub(name));
    this.setState({loading: true});
  }

  componentDidMount() {
    this.props.dispatch(app.loadNotebooks());
  }

  render() {
    return <Notebooks notebooks={this.props.notebooks} onOpen={this.onOpen} />;
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
