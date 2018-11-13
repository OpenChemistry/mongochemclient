import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { push } from 'connected-react-router';

import NotebooksTable from '../components/notebooks/table'

import { calculations, jupyterlab } from '@openchemistry/redux'
import { selectors } from '@openchemistry/redux'
import { auth } from '@openchemistry/girder-redux';

class CalculationNotebooksContainer extends Component {

  componentDidMount() {
    this.props.dispatch(calculations.loadCalculationNotebooks(this.props.calculationId));
  }

  onOpen = (notebook) => {
    const { me, dispatch } = this.props;
    const meId = me ? me['_id'] : '';
    if (meId === notebook['creatorId']) {
      // If owner redirect to the notebook
      const name = notebook['name'];
      dispatch(jupyterlab.redirectToJupyterHub(name));
    } else {
      // Else, redirect to a read-only view of the notebook
      const notebookId = notebook['_id'];
      this.props.dispatch(push(`/notebooks/${notebookId}`));
    }
  }

  render() {
    return <NotebooksTable notebooks={this.props.notebooks} onOpen={this.onOpen} />;
  }
}

CalculationNotebooksContainer.propTypes = {
  calculationId: PropTypes.string,
  notebooks: PropTypes.array,
}

CalculationNotebooksContainer.defaultProps = {
  calculationId: null,
  notebooks: [],
}

function mapStateToProps(state, ownProps) {
  const props = {...ownProps};

  if (!_.isNil(ownProps.calculationId)) {
    const notebooks = selectors.calculations.getNotebooks(state, ownProps.calculationId);
    if (!_.isNil(notebooks)) {
      props.notebooks = notebooks;
    }
  }

  props.me = auth.selectors.getMe(state);

  return props;
}

export default connect(mapStateToProps)(CalculationNotebooksContainer)
