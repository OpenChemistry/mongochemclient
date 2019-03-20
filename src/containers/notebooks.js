import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { jupyterlab } from '@openchemistry/redux';
import { auth } from '@openchemistry/girder-redux';

import Notebooks from '../components/notebooks'

import { app } from '@openchemistry/redux'
import { selectors } from '@openchemistry/redux'
import { isNil } from 'lodash-es';

class NotebooksContainer extends Component {

  onOpen = (notebook) =>  {
    const name = notebook ? notebook.name : null;
    this.props.dispatch(jupyterlab.redirectToJupyterHub(name));
  }

  componentDidMount() {
    this.loadNotebooks();
  }

  componentWillUpdate(prevProps) {
    if (isNil(prevProps.me)) {
      this.loadNotebooks();
    }
  }

  loadNotebooks() {
    const { me, dispatch } = this.props;
    if (!isNil(me)) {
      dispatch(app.loadNotebooks());
    }
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
    const {notebooks, redirecting} = this.props;
    return <Notebooks notebooks={notebooks} onOpen={this.onOpen} redirecting={redirecting} />;
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
  const redirecting = selectors.jupyterlab.redirecting(state);
  const me = auth.selectors.getMe(state);
  return {
    notebooks,
    me,
    redirecting
  };
}

export default connect(mapStateToProps)(NotebooksContainer)
