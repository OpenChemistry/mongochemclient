import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Molecule3d from 'molecule-3d-for-react'


class Molecule extends Component {

  render() {
    return (
      <div>
        <Molecule3d modelData={ moleculeToModelData(this.props.cjson) } />
      </div>
    );
  }
}

Molecule.propTypes = {
  cjson: PropTypes.object,
}

Molecule.defaultProps = {
  cjson: null
}

function moleculeToModelData(cjson) {
  let modelData = {
      atoms: [],
      bonds: []
  }

  if (cjson == null) {
    return modelData
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

export default Molecule
