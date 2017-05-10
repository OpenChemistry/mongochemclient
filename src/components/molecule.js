import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Molecule3d from 'molecule-3d-for-react'

const elementSymbols = [
  "Xx", "H", "He", "Li", "Be", "B", "C", "N", "O", "F",
  "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K",
  "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu",
  "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y",
  "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In",
  "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr",
  "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm",
  "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au",
  "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac",
  "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es",
  "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt",
  "Ds", "Rg", "Cn", "Uut", "Uuq", "Uup", "Uuh", "Uus", "Uuo" ];

const orbitalScale = 42

class Molecule extends Component {

  render() {
    return (
      <div>
        <Molecule3d modelData={ moleculeToModelData(this.props.cjson) }
                    volume={ this.props.cjson && this.props.cjson.cube ? this.props.cjson.cube : null }
                    isoSurfaces={ this.props.cjson ? isoSurfaces(this.props.cjson) : []}/>
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
  for (let [i, element] of atoms.elements.number.entries()) {
    const coords = atoms.coords['3d'];
    const coordsIndex = i * 3;
    let positions = [coords[coordsIndex], coords[coordsIndex+1], coords[coordsIndex+2]];

    let atom = {
        elem: elementSymbols[element],
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

function isoSurfaces(cjson) {

  if (!'cube' in cjson) {
    return [];
  }

  const iso = (orbitalScale + 1) / 2000.0;

  return [{
    value: iso,
    color: 'blue',
    opacity: 0.9,
  }, {
    value: -iso,
    color: 'red',
    opacity: 0.9
  }
  ];
}


export default Molecule
