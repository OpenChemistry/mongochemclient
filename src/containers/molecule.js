import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadMolecule, loadMoleculeById } from '../redux/ducks/molecules'
import Molecule from '../components/molecule'
import selectors from '../redux/selectors'

class MoleculeContainer extends Component {

  componentDidMount() {
    if (this.props.id != null) {
      this.props.dispatch(loadMoleculeById(this.props.id));
    }
    else if (this.props.inchikey != null) {
      this.props.dispatch(loadMolecule(this.props.inchikey ));
    }
  }

  render() {
    return <Molecule cjson={this.props.cjson} />
  }
}

MoleculeContainer.propTypes = {
  id: PropTypes.string,
  inchikey: PropTypes.string
}

MoleculeContainer.defaultProps = {
  id: null,
  inchikey: null
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
    props.cjson = molecules[id].cjson;
  }
  else if (inchikey != null) {
    let byInchiKey = selectors.molecules.byInchiKey(state);
    if (inchikey in byInchiKey) {
      // TODO change we hide this in a selector with a parameter?
      props.cjson = molecules[byInchiKey[inchikey]].cjson;
    }
  }

  return props;
}

export default connect(mapStateToProps)(MoleculeContainer)
