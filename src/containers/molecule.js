import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadMoleculeById } from '../redux/ducks/molecules'
import Molecule from '../components/molecule'
import selectors from '../redux/selectors'

class MoleculeContainer extends Component {

  componentDidMount() {
    this.props.dispatch(loadMoleculeById(this.props.id));
  }

  render() {
    return <Molecule cjson={this.props.cjson} />;
  }
}

MoleculeContainer.propTypes = {
  id: PropTypes.string.isRequired,
}

MoleculeContainer.defaultProps = {
  id: null
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.match.params.id;
  let props = {
    id
  }

  let molecules = selectors.molecules.getMoleculesById(state);
  if (id in molecules) {
    props.cjson = molecules[id].cjson;
  }

  return props;
}

export default connect(mapStateToProps)(MoleculeContainer)
