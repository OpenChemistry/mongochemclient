import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { selectors } from '@openchemistry/redux'
import { molecules, calculations } from '@openchemistry/redux'

import Molecule from '../components/molecule';
import { push } from 'connected-react-router';

class MoleculeContainer extends Component {


  componentDidMount() {
    const { id, inchikey, dispatch } = this.props;
    if (id != null) {
      dispatch(molecules.loadMoleculeById(id));
    }
    else if (inchikey != null) {
      dispatch(molecules.loadMolecule(inchikey ));
    }
    this.fetchMoleculeCalculations();
  }

  componentDidUpdate(prevProps) {
    const molecule = this.props.molecule || {};
    const prevMolecule = prevProps.molecule || {};
    if (molecule._id !== prevMolecule._id) {
      this.fetchMoleculeCalculations();
    }
  }

  fetchMoleculeCalculations() {
    const { molecule, dispatch } = this.props;
    if (molecule && molecule._id) {
      dispatch(calculations.loadCalculations({moleculeId: molecule._id}));
    }
  }

  onCalculationClick = (calculation) => {
    const {dispatch} = this.props;
    dispatch(push(`/calculations/${calculation._id}`));
  }

  render() {
    const { molecule, calculations, creator } = this.props;

    if (molecule) {
      return (
        <Molecule
          molecule={molecule}
          calculations={calculations}
          onCalculationClick={this.onCalculationClick}
          creator={creator}
          />
      );
    } else {
      return null;
    }
  }
}

MoleculeContainer.propTypes = {
  id: PropTypes.string,
  inchikey: PropTypes.string,
  molecule: PropTypes.object,
  calculations: PropTypes.array
}

MoleculeContainer.defaultProps = {
  id: null,
  inchikey: null,
  molecule: null,
  calculations: []
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.match.params.id || null;
  let inchikey = ownProps.match.params.inchikey || null;
  let creator = selectors.molecules.getMoleculeCreator(state);
  let props = {
    id,
    inchikey,
    creator
  }

  let molecules = selectors.molecules.getMoleculesById(state);
  if (id != null && id in molecules) {
    props.molecule = molecules[id];
  } else if (inchikey != null) {
    let byInchiKey = selectors.molecules.byInchiKey(state);
    if (inchikey in byInchiKey) {
      // TODO change we hide this in a selector with a parameter?
      props.molecule = molecules[byInchiKey[inchikey]];
    }
  }

  if (props.molecule) {
    props.calculations = selectors.calculations.getMoleculeCalculations(state, props.molecule._id);
  }

  return props;
}

export default connect(mapStateToProps)(MoleculeContainer)
