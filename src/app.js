import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import logo from './mongochem.svg';
import './app.css';
import { loadMolecule } from './redux/ducks/molecules'
import { selectMolecule } from './redux/ducks/app'
import selectors from './redux/selectors';
import Molecule3d from 'molecule-3d-for-react'


class App extends Component {

  fetchMolecule = () =>  {
    const inchikey = this.props.molecules[0].inchikey;
    const id = this.props.molecules[0].id;
    this.props.dispatch(selectMolecule(id));
    this.props.dispatch(loadMolecule(inchikey));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to MongoChemWeb</h2>
        </div>
        <pre>
          { JSON.stringify(this.props.molecules, null, 2) }
        </pre>
        <Molecule3d modelData={ this.props.modelData } />
        <button onClick={this.fetchMolecule}>Fetch molecule!</button>
      </div>
    );
  }
}

App.propTypes = {
  molecules: PropTypes.array.isRequired,
  selectedMolecule: PropTypes.object,
  modelData: PropTypes.object,
}

App.defaultProps = {
  molecules: [],
  selectedMolecules: null,
  modelData: {
    atoms: [],
    bonds: []
  }
}

function moleculeToModelData(molecule) {
  if (molecule == null) {
    return null;
  }
  const cjson = molecule.cjson;

  let modelData = {
      atoms: [],
      bonds: []
  }

  const atoms = cjson.atoms;
  for (let [i, element] of atoms.elements.symbol.entries()) {
    const coords = atoms.coords['3d'];
    const coordsIndex = i * 3;
    let positions = [coords[coordsIndex], coords[coordsIndex+1], coords[coordsIndex+2]];

    let atom = {
        elem: element,
        serial: i,
        positions,
    }

    modelData.atoms.push(atom);
  }

  const bonds = cjson.bonds;
  for (let [i, order] of bonds.order.entries()) {
    const connections = bonds.connections.index;
    const connectionIndex = i*2;
    let bond = {
      atom1_index: connections[connectionIndex],
      atom2_index: connections[connectionIndex+1],
      bond_order: order
    }
    modelData.bonds.push(bond);
  }


  return modelData;
}


function mapStateToProps(state) {
  let props = {
    molecules: selectors.molecules.getMolecules(state),
    selectedMolecule: selectors.app.getSelectedMolecule(state),
  }

  let selectedMolecule = selectors.app.getSelectedMolecule(state);
  if (selectedMolecule != null) {
    props.modelData = moleculeToModelData(selectedMolecule);
  }

  return props;
}


export default connect(mapStateToProps)(App)
