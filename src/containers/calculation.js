import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadCalculationById, loadOrbital } from '../redux/ducks/calculations'
import Molecule from '../components/molecule'
import selectors from '../redux/selectors'

class Calculation extends Component {

  render() {
    return <Molecule cjson={this.props.cjson}
                     isoSurfaces={this.props.isoSurfaces}
                     onOrbital={this.props.onOrbital}
                     orbitalControls={true}
                     orbital={this.props.orbital}/>;
  }
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.id || null;
  let orbital = ownProps.orbital || null;
  let props = {
    id,
    orbital,
  }

  let calculations = selectors.calculations.getCalculationsById(state);
  if (id != null && id in calculations) {
    props.cjson = calculations[id].cjson;
  }

  let orbitals = selectors.calculations.getOrbitals(state, id)
  if (orbital != null && orbital in orbitals) {
    props.cjson  = {...props.cjson, cube: orbitals[orbital].cube};
  }

  return props;
}

Calculation = connect(mapStateToProps)(Calculation)

class CalculationContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onOrbital = this.onOrbital.bind(this);
  }

  componentWillMount() {
    const params = new URLSearchParams(this.props.location.search);
    let iso = params.get('iso');
    iso = parseFloat(iso);
    if (iso) {
      this.setState({
        isoSurfaces: [{
          value: iso,
          color: 'blue',
          opacity: 0.9,
        }, {
          value: -iso,
          color: 'red',
          opacity: 0.9
        }
        ]
      });
    }

    let orbital = params.get('mo');
    orbital = parseInt(orbital);
    if (orbital) {
      this.setState({
        orbital,
      })
    }

    if (this.props.match.params.id) {
      const id = this.props.match.params.id;
      this.setState({
        id,
      })
    }
  }

  componentDidMount() {
    if (this.state.id != null) {
      this.props.dispatch(loadCalculationById(this.state.id));

      if (this.state.orbital) {
        this.props.dispatch(loadOrbital(this.state.id, this.state.orbital));
      }
    }
  }

  render() {
    return <Calculation
      cjson={this.props.cjson}
      id={this.state.id}
      orbital={this.state.orbital}
      isoSurfaces={this.state.isoSurfaces}
      onOrbital={this.onOrbital}/>;
  }

  onOrbital(orbital) {
    this.setState({
      orbital,
    })
    this.props.dispatch(loadOrbital(this.state.id, orbital));
  }
}

CalculationContainer.propTypes = {
  id: PropTypes.string,
  inchikey: PropTypes.string
}

CalculationContainer.defaultProps = {
  id: null,
  inchikey: null
}

export default connect()(CalculationContainer)
