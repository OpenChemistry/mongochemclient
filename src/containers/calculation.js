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
                     orbitalControls={!!this.props.orbital}
                     animation={this.props.animation}
                     animateMode={this.props.animateMode}
                     orbital={this.props.orbital}/>;
  }
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.id || null;
  let orbital = ownProps.orbital || null;
  let cjson = ownProps.cjson || null;

  let props = {
    id,
    orbital,
    cjson,
  }

  let calculations = selectors.calculations.getCalculationsById(state);
  if (id != null && id in calculations) {
    props.cjson = calculations[id].cjson;
  }

  let orbitals = selectors.calculations.getOrbitals(state, id)
  if (orbital != null) {
    if (orbital in orbitals) {
      props.cjson  = {...props.cjson, cube: orbitals[orbital].cube};
    }
    // Remove any orbital data
    else if (props.cjson != null) {
      delete props.cjson.cube;
    }
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
    if (this.props.match) {
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

      let orbital = params.get('mo')

      if (orbital) {
        orbital = orbital.toLowerCase();
      }

      if ( orbital !== 'lumo' && orbital !== 'homo') {
        orbital = parseInt(orbital, 10);
      }
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
    else {
      if (this.props.id) {
        const id = this.props.id;
        this.setState({
          id,
        })
      }

      if (this.props.orbital) {
        const orbital = this.props.orbital;
        this.setState({
          orbital,
        })
      }
    }
  }

  componentDidMount() {
    if (this.state.id && !this.props.cjson) {
      this.props.dispatch(loadCalculationById(this.state.id));

    }

    if (this.state.id && this.state.orbital) {
        this.props.dispatch(loadOrbital(this.state.id, this.state.orbital));
    }
  }

  render() {
    return <Calculation
      cjson={this.props.cjson}
      id={this.state.id}
      orbital={this.state.orbital}
      isoSurfaces={this.state.isoSurfaces}
      onOrbital={this.onOrbital}
      animation={this.props.animation}
      animateMode={this.props.animateMode}/>;
  }

  onOrbital(orbital) {
    this.setState({
      orbital,
    })
    this.props.dispatch(loadOrbital(this.state.id, orbital));
  }
}

CalculationContainer.propTypes = {
  cjson: PropTypes.object,
  id: PropTypes.string,
  inchikey: PropTypes.string
}

CalculationContainer.defaultProps = {
  cjson: null,
  id: null,
  orbital: null,
  inchikey: null
}

export default connect()(CalculationContainer)
