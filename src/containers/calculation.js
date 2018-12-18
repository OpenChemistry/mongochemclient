import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { calculations } from '@openchemistry/redux'

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
    const { dispatch, id, iOrbital} = this.props;
    dispatch(calculations.loadCalculationById(id));
    if (!isNil(iOrbital)) {
      dispatch(calculations.loadOrbital(id, iOrbital));
    }
  }

  componentDidMount() {
    if (this.state.id && !this.props.cjson) {
      this.props.dispatch(calculations.loadCalculationById(this.state.id));

    }

    if (this.state.id && this.state.orbital) {
        this.props.dispatch(calculations.loadOrbital(this.state.id, this.state.orbital));
    }
  }

  onIOrbitalChanged = (e) => {
    let iOrbital = e.detail;
    if (iOrbital === this.props.iOrbital) {
      return;
    }
    const {id, location, dispatch} = this.props;
    let params = new URLSearchParams(location.search);

    if (iOrbital != -1) {
      dispatch(calculations.loadOrbital(id, iOrbital));
      params.set('iOrbital', iOrbital);
    } else {
      params.delete('iOrbital');
    }

    dispatch(push(`/calculations/${id}?${params.toString()}`));
  }

  render() {
    const { id, iOrbital, cjson, showNotebooks, calculationProperties, molecule} = this.props;
    if (isNil(cjson)) {
      return null;
    }
    return (
      <div style={{width:'100%', height: '40rem'}}>
        <Calculation
          cjson={cjson}
          id={id}
          onIOrbitalChanged={this.onIOrbitalChanged}
          showNotebooks={showNotebooks}
          calculationProperties={calculationProperties}
          molecule={molecule}
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
  cjson: PropTypes.object,
  id: PropTypes.string,
  iOrbital: PropTypes.any,
  inchikey: PropTypes.string,
  showNotebooks: PropTypes.bool,
  calculationProperties: PropTypes.object,
  molecule: PropTypes.object,
  isoValue: PropTypes.number,
  iMode: PropTypes.number,
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
  cjson: null,
  id: null,
  iOrbital: null,
  inchikey: null,
  showNotebooks: true,
  calculationProperties: null,
  molecule: null,
  isoValue: null,
  iMode: null,
  play: null,
  showVolume: null,
  showIsoSurface: null,
  showSpectrum: null,
  showMenu: null,
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
  let calculationProperties;
  let molecule;

  let props = {
    id,
    iOrbital,
    cjson,
    calculationProperties,
    molecule
  }

  const params = new URLSearchParams(ownProps.location.search);

  // iOrbital can come either from the route or from a query parameter

  if (params.has('iOrbital')) {
    let mo = params.get('iOrbital');
    mo = mo.toLowerCase();
    if (mo === 'homo' || mo ==='lumo') {
      iOrbital = mo;
    } else {
      let iMo = parseInt(mo);
      if (isFinite(iMo)) {
        iOrbital = iMo;
      }
    }
    props['iOrbital'] = iOrbital;
  }

  if (params.has('iMode')) {
    let mode = params.get('iMode');
    mode = parseInt(mode);
    if (isFinite(mode)) {
      props['iMode'] = mode;
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
    props.calculationProperties = calculations[id].properties;
    props.cjson = calculations[id].cjson;
    const molecules = selectors.molecules.getMoleculesById(state);
    if (calculations[id].moleculeId in molecules) {
      props.molecule = molecules[calculations[id].moleculeId];
    }
  }

  let orbitals = selectors.calculations.getOrbitals(state, id);
  if (!isNil(props.cjson) && !isNil(iOrbital) && iOrbital in orbitals) {
    props.cjson  = {...props.cjson, cube: orbitals[iOrbital].cube};
  } else if (!isNil(props.cjson)) {
    // Remove any orbital data
    delete props.cjson.cube;
  }

  return props;
}

export default connect(mapStateToProps)(CalculationContainer)
