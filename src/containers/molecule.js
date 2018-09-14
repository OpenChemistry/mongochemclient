import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { selectors } from '@openchemistry/redux'
import { molecules } from '@openchemistry/redux'

import Molecule from '../components/molecule';

class MoleculeContainer extends Component {


  componentDidMount() {
    if (this.props.id != null) {
      this.props.dispatch(molecules.loadMoleculeById(this.props.id));
    }
    else if (this.props.inchikey != null) {
      this.props.dispatch(molecules.loadMolecule(this.props.inchikey ));
    }
  }

  render() {
    const { molecule } = this.props;

    if (molecule) {
      return (
        <Molecule molecule={molecule} />
      );
    } else {
      return null;
    }
  }
}

MoleculeContainer.propTypes = {
  id: PropTypes.string,
  inchikey: PropTypes.string,
  molecule: PropTypes.object
}

MoleculeContainer.defaultProps = {
  id: null,
  inchikey: null,
  molecule: null
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.match.params.id || null;
  let inchikey = ownProps.match.params.inchikey || null;
  let props = {
    id,
    inchikey
  }

  let molecules = selectors.molecules.getMoleculesById(state);
  if (id != null && id in molecules) {
    props.molecule = molecules[id];
  }
  else if (inchikey != null) {
    let byInchiKey = selectors.molecules.byInchiKey(state);
    if (inchikey in byInchiKey) {
      // TODO change we hide this in a selector with a parameter?
      props.molecule = molecules[byInchiKey[inchikey]];
    }
  }

  return props;
}

export default connect(mapStateToProps)(MoleculeContainer)
