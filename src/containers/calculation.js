import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';

import AssignmentIcon from '@material-ui/icons/Assignment';

// import Molecule from '../components/molecule'
import { wc } from '../utils/webcomponent';
import CalculationNotebooksContainer from './calculationnotebooks'

import { selectors } from '@openchemistry/redux'
import { calculations } from '@openchemistry/redux'

class Calculation extends Component {

  render() {
    return(
      <div style={{height: '30rem', width: '100%'}}>
        <oc-molecule
          ref={wc(
            // Events
            {},
            //Props
            {
              cjson: this.props.cjson
            }
          )}
        />
      </div>
    );
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
    this.state = {
      open: false,
    };
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
      this.props.dispatch(calculations.loadCalculationById(this.state.id));

    }

    if (this.state.id && this.state.orbital) {
        this.props.dispatch(calculations.loadOrbital(this.state.id, this.state.orbital));
    }
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    const style = {
        buttonDiv: {
          position: 'relative',
          width: '100%',
        },
        button: {
          position: 'absolute',
          right: '2rem'
        },
        popover: {
          width: "40rem",
          maxWidth: '100%'
        }
    };

    return <div>
             <Calculation
               cjson={this.props.cjson}
               id={this.state.id}
               orbital={this.state.orbital}
               isoSurfaces={this.state.isoSurfaces}
               onOrbital={this.onOrbital}
               animation={this.props.animation}
               animateMode={this.props.animateMode}/>
             { this.props.showNotebooks &&
               <div style={style.buttonDiv}>
                 <Button variant="fab" onClick={this.handleTouchTap} style={style.button}>
                   <AssignmentIcon/>
                 </Button>
               </div>
             }

               <Popover
                 open={this.state.open}
                 anchorEl={this.state.anchorEl}
                 transformOrigin={{vertical: 'bottom', horizontal: 'right'}}
                 anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                 onClose={this.handleRequestClose}
                 animation={PopoverAnimationVertical}
               >
                <div style={style.popover}>
                  <CalculationNotebooksContainer
                    calculationId={this.state.id}
                  />
                </div>
               </Popover>

           </div>;
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
  inchikey: PropTypes.string,
  showNotebooks: PropTypes.bool
}

CalculationContainer.defaultProps = {
  cjson: null,
  id: null,
  orbital: null,
  inchikey: null,
  showNotebooks: true
}

export default connect()(CalculationContainer)
