import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MoleculeMenu from './menu.js'
import { wc } from '../utils/webcomponent';

class Molecule extends Component {

  componentRef = 0;

  static generateOrbitals(cjson) {
    if (!cjson) {
      return [];
    }

    if (!cjson.basisSet || !cjson.molecularOrbitals) {
      return [];
    }

    const numbers = cjson.molecularOrbitals.numbers;
    const electronCount = cjson.basisSet.electronCount;
    const energies = cjson.molecularOrbitals.energies

    const orbitals = [];
    for (let i = 0; i < numbers.length; i += 1) {
        const mode = numbers[i];
        const energy = energies[i].toFixed(4);

        let text = '';
        if (mode === electronCount / 2) {
            text = ' (HOMO)';
        }
        else if (mode === electronCount / 2 + 1) {
            text = ' (LUMO)';
        }
        //
        let oObj = { id: mode, label: `${mode}, ${energy}` + text };
        orbitals.push(oObj);
    }

    return orbitals;
  }

  constructor(props) {
    super(props)

    if (props.animation) {
      this.state = {
          animation: {...props.animation}
      }
    } else if (props.cjson && props.cjson.vibrations && props.cjson.vibrations.eigenVectors) {
      this.state = {
        animation: {
          play: true,
          scale: 1,
          modeIdx: -1,
          nModes: props.cjson.vibrations.eigenVectors.length
        }
      }
    }
    else {
      this.state = {}
    }

    if (this.props.isoSurfaces) {
      this.state.isoSurfaces = props.isoSurfaces;
    }
    else {
      this.state.isoSurfaces = this.isoSurfaces();
    }
  }

  onAmplitude = (value) => {
    this.setState({
      animation: {...this.state.animation, ...{scale: value}}
    });
  }

  onModeChange = (value) => {
    this.setState({
      animation: {...this.state.animation, ...{modeIdx: value}}
    });
  }

  onPlayToggled = (value) => {
    console.log(value);
    this.setState({
      animation: {...this.state.animation, ...{play: value}}
    })
  }

  onIsoScale = (value) => {
    const isoSurfaces = this.isoSurfaces(value);
    this.setState({
      isoSurfaces: isoSurfaces
    })
    this._setWcOptions()
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    const animation = this.state.animation;
    const hasVolume = !!this.props.cjson && !!this.props.cjson.cube;
    const hasAnimation = !!animation;
    const hasSpectrum = !!this.props.cjson.vibrations.frequencies;
    const n = hasSpectrum ? 2 : 1;
    const sizes = hasSpectrum ? "0.4, 0.6" : "1.0";

    return (
      <div>
      { (hasAnimation || hasVolume || this.props.orbitalControls) &&
        <MoleculeMenu 
          onAmplitude={this.onAmplitude}
          onIsoScale={this.onIsoScale}
          animation={animation}
          onModeChange={this.onModeChange}
          onPlayToggled={this.onPlayToggled}
          orbitalControls={hasVolume || this.props.orbitalControls}
          isoValue={this.state.isoSurfaces[0].value}
          orbitals={Molecule.generateOrbitals(this.props.cjson)}
          onOrbital={this.props.onOrbital}
          orbital={this.props.orbital}
        />
      }
        <div style={{width: "100%", height: "30rem"}}>
          <split-me n={n} sizes={sizes}>
            <div slot="0" style={{width: "100%", height: "100%"}}>
              <oc-molecule-moljs
                ref={wc(
                  // Events
                  {},
                  // Props
                  {
                    cjson: this.props.cjson,
                    options: {
                      isoSurfaces: this.state.isoSurfaces,
                      normalMode: this.state.animation
                    }
                  })
                }
              />
            </div>
          { hasSpectrum &&
          <div slot="1" style={{width: "100%", height: "100%"}}>
            <oc-vibrational-spectrum
              ref={wc(
                // Events
                {barSelected: (e)=>{this.onModeChange(e.detail);}},
                // Props
                {
                  vibrations: this.props.cjson.vibrations,
                  options: this.state.animation
                })
              }
            />
          </div>
          }
          </split-me>
        </div>
      </div>
    );
  }

  isoSurfaces(scale = 42) {
    const iso = (scale + 1) / 2000.0;

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

}

Molecule.propTypes = {
  cjson: PropTypes.object,
  isoSurfaces: PropTypes.array,
  animateMode: PropTypes.number
}

Molecule.defaultProps = {
  cjson: null,
  isoSurfaces: null,
  animateMode: null
}

/* Obsolete, conversion from cjson is now done in the individual components
function moleculeToModelData(cjson, mode) {
  let modelData = {
      atoms: [],
      bonds: []
  }
  let eigenVectors = null;

  if (cjson == null) {
    return modelData
  }

  if (mode != null) {
    eigenVectors = cjson.vibrations.eigenVectors[mode-1];
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

    if (eigenVectors != null) {
      atom.dx = eigenVectors[coordsIndex];
      atom.dy = eigenVectors[coordsIndex+1];
      atom.dz = eigenVectors[coordsIndex+2];
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
*/

export default Molecule
