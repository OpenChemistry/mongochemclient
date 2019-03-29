import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import {
  selectors,
  calculations,
  molecules
} from '@openchemistry/redux'

import Calculation from '../components/calculation';

import { isNil } from 'lodash-es';

class CalculationContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.onOrbital = this.onOrbital.bind(this);
  }

  componentWillMount() {
    const { dispatch, id, mo } = this.props;
    dispatch(calculations.loadCalculationById(id));
    if (!isNil(mo)) {
      dispatch(calculations.loadOrbital(id, mo));
    }
    this.fetchMolecule();
  }

  componentDidMount() {
    if (this.state.id && !this.props.cjson) {
      this.props.dispatch(calculations.loadCalculationById(this.state.id));

    }

    if (this.state.id && this.state.orbital) {
        this.props.dispatch(calculations.loadOrbital(this.state.id, this.state.orbital));
    }
  }

  componentWillUpdate() {
    this.fetchMolecule();
  }

  fetchMolecule() {
    const { dispatch, calculation, molecule } = this.props;
    if (!isNil(calculation) && isNil(molecule)) {
      dispatch(molecules.loadMoleculeById(calculation.moleculeId));
    }
  }

  onIOrbitalChanged = (e) => {
    let iOrbital = e.detail;
    if (iOrbital === this.props.mo) {
      return;
    }
    const {id, location, dispatch} = this.props;
    let params = new URLSearchParams(location.search);

    if (iOrbital != -1) {
      dispatch(calculations.loadOrbital(id, iOrbital));
      params.set('mo', iOrbital);
    } else {
      params.delete('mo');
    }

    dispatch(push(`/calculations/${id}?${params.toString()}`));
  }

  render() {
    const { id, calculation, showNotebooks, molecule} = this.props;
    if (isNil(calculation) || isNil(calculation.cjson)) {
      return null;
    }
    return (
      <div style={{width:'100%', height: '40rem'}}>
        <Calculation
          calculation={calculation}
          molecule={molecule}
          id={id}
          onIOrbitalChanged={this.onIOrbitalChanged}
          showNotebooks={showNotebooks}
          {...this.props}
        />
      </div>
    );
  }

  onOrbital(orbital) {
    this.setState({
      orbital,
    })
    this.props.dispatch(calculations.loadOrbital(this.state.id, orbital));
  }
}

CalculationContainer.propTypes = {
  calculation: PropTypes.object,
  cube: PropTypes.object,
  id: PropTypes.string,
  mo: PropTypes.any,
  inchikey: PropTypes.string,
  showNotebooks: PropTypes.bool,
  molecule: PropTypes.object,
  isoValue: PropTypes.number,
  mode: PropTypes.number,
  play: PropTypes.bool,
  showVolume: PropTypes.bool,
  showIsoSurface: PropTypes.bool,
  showSpectrum: PropTypes.bool,
  showMenu: PropTypes.bool,
  colors: PropTypes.array,
  colorsX: PropTypes.array,
  opacities: PropTypes.array,
  opacitiesX: PropTypes.array,
  activeMapName: PropTypes.string,
  moleculeRenderer: PropTypes.string
}

CalculationContainer.defaultProps = {
  calculation: null,
  cube: null,
  id: null,
  mo: null,
  inchikey: null,
  showNotebooks: true,
  molecule: null,
  isoValue: 0.01,
  mode: null,
  play: null,
  showVolume: false,
  showIsoSurface: true,
  showSpectrum: false,
  showMenu: true,
  colors: null,
  colorsX: null,
  opacities: null,
  opacitiesX: null,
  activeMapName: null,
  moleculeRenderer: 'moljs'
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.match.params.id;
  let iOrbital = ownProps.match.params.iOrbital;
  let cjson;
  let calculationInput;
  let molecule;

  let props = {
    id,
    mo: iOrbital,
    cjson,
    calculationInput,
    molecule
  }

  const params = new URLSearchParams(ownProps.location.search);

  // iOrbital can come either from the route or from a query parameter

  if (params.has('mo')) {
    let mo = params.get('mo');
    mo = mo.toLowerCase();
    if (mo === 'homo' || mo ==='lumo') {
      iOrbital = mo;
    } else {
      mo = parseInt(mo);
      if (isFinite(mo)) {
        iOrbital = mo;
      }
    }
    props['mo'] = iOrbital;
  }

  if (params.has('mode')) {
    let mode = params.get('mode');
    mode = parseInt(mode);
    if (isFinite(mode)) {
      props['mode'] = mode;
    }
  }

  if (params.has('isoValue')) {
    let val = params.get('isoValue');
    val = parseFloat(val);
    if (isFinite(val)) {
      props['isoValue'] = val;
    }
  }

  if (params.has('moleculeRenderer')) {
    if (params.get('moleculeRenderer') === 'vtkjs') {
      props['moleculeRenderer'] = 'vtkjs';
    } else {
      props['moleculeRenderer'] = 'moljs';
    }
  }

  if (params.has('showIsoSurface')) {
    props['showIsoSurface'] = params.get('showIsoSurface').toLowerCase() === 'true';
  }

  if (params.has('showVolume')) {
    props['showVolume'] = params.get('showVolume').toLowerCase() === 'true';
  }

  if (params.has('showSpectrum')) {
    props['showSpectrum'] = params.get('showSpectrum').toLowerCase() === 'true';
  }

  if (params.has('showMenu')) {
    props['showMenu'] = params.get('showMenu').toLowerCase() === 'true';
  }

  if (params.has('play')) {
    props['play'] = params.get('play').toLowerCase() === 'true';
  }

  const validateArray = (s) => {
    try {
      let arr = JSON.parse(s);
      if (Array.isArray(arr)) {
        return arr;
      }
    } catch(e) {}
    return null;
  }

  if (params.has('opacities')) {
    props['opacities'] = validateArray(params.get('opacities'));
  }

  if (params.has('opacitiesX')) {
    props['opacitiesX'] = validateArray(params.get('opacitiesX'));
  }

  if (params.has('colors')) {
    props['colors'] = validateArray(params.get('colors'));
  }

  if (params.has('colorsX')) {
    props['colorsX'] = validateArray(params.get('colorsX'));
  }

  let calculations = selectors.calculations.getCalculationsById(state);
  if (!isNil(id) && id in calculations) {
    props.calculation = calculations[id];
    const molecules = selectors.molecules.getMoleculesById(state);
    if (calculations[id].moleculeId in molecules) {
      props.molecule = molecules[calculations[id].moleculeId];
    }
  }

  let orbitals = selectors.calculations.getOrbitals(state, id);
  if (!isNil(iOrbital) && iOrbital in orbitals) {
    props.cube  = orbitals[iOrbital].cube;
  } else {
    // Remove any orbital data
    props.cube = null;
  }

  const config = selectors.configuration.getConfiguration(state);
  if (!isNil(config) && !isNil(config.features)) {
    props.showNotebooks = config.features.notebooks;
  }

  return props;
}

export default connect(mapStateToProps)(CalculationContainer)
