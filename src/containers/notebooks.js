import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { jupyterlab } from '@openchemistry/redux';
import { auth } from '@openchemistry/girder-redux';

import Notebooks from '../components/notebooks'

import { app } from '@openchemistry/redux'
import { selectors } from '@openchemistry/redux'

class NotebooksContainer extends Component {

  onOpen = (notebook) =>  {
    const name = notebook.name
    this.props.dispatch(jupyterlab.redirectToJupyterHub(name));
  }

  componentDidMount() {
    this.props.dispatch(app.loadNotebooks());
  }

  componentDidUpdate(prevProps) {
    const { me } = this.props;
    const prevMe = prevProps.me;
    const meId = me ? me._id : '';
    const prevMeId = prevMe ? prevMe._id : '';
    if (meId !== prevMeId) {
      this.props.dispatch(app.loadNotebooks());
    }
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
  const me = auth.selectors.getMe(state);
  return {
    notebooks,
    me
  };
}

export default connect(mapStateToProps)(NotebooksContainer)
