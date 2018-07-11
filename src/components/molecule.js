import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { wc } from '../utils/webcomponent';

import IconButton from '@material-ui/core/IconButton';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';

import MoreVertIcon from '@material-ui/icons/MoreVert';

class Molecule extends Component {

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
      this.state = {
        animation: {
          play: false,
          scale: 1,
          modeIdx: -1,
          nModes: -1
        }
      }
    }

    if (this.props.isoSurfaces) {
      this.state.isoSurfaces = props.isoSurfaces;
    }
    else {
      this.state.isoSurfaces = this.isoSurfaces();
    }

    this.state.menu = {
      open: false,
      anchorEl: null
    }

    this.state.splitDirection = "horizontal";
    this.updateSplitDirection = this.updateSplitDirection.bind(this);
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
    this.setState({
      animation: {...this.state.animation, ...{play: value}}
    })
  }

  onIsoScale = (value) => {
    const isoSurfaces = this.isoSurfaces(value);
    this.setState({
      isoSurfaces: isoSurfaces
    })
  }

  onMenuOpen = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      menu: {
        open: true,
        anchorEl: event.currentTarget
      }
    });
  };

  onMenuClose = () => {
    this.setState({
      menu: {
        open: false
      }
    });
  };

  componentDidMount() {
    this.updateSplitDirection();
    window.addEventListener('resize', this.updateSplitDirection);
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSplitDirection);
  }
  
  updateSplitDirection() {
    let dir = window.innerWidth / window.devicePixelRatio > 800 ? 'horizontal' : 'vertical';
    if (dir !== this.state.splitDirection) {
      this.setState({splitDirection: dir});
    }
  }

  render() {
    const animation = this.state.animation;
    const hasVolume = !!this.props.cjson && !!this.props.cjson.cube;
    const hasAnimation = !!animation;
    const hasSpectrum = !!this.props.cjson && !!this.props.cjson.vibrations && !!this.props.cjson.vibrations.frequencies;
    const n = hasSpectrum ? 2 : 1;
    const sizes = hasSpectrum ? "0.4, 0.6" : "1.0";

    return (
      <div>
        <div style={{width: "100%", height: "40rem", position: "relative"}}>
          <split-me slot="0" n={n} d={this.state.splitDirection} sizes={sizes}>
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
                      normalMode: animation
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
                    options: animation
                  })
                }
              />
            </div>
            }
          </split-me>
          { (hasAnimation || hasVolume || this.props.orbitalControls) &&
          <div style={{position: "absolute", right: 0, top: 0, marginTop: "0.5rem", marginRight: "0.5rem"}}>
            <IconButton onClick={this.onMenuOpen}>
              <MoreVertIcon/>
            </IconButton>
            <Popover
              open={this.state.menu.open}
              anchorEl={this.state.menu.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              onClose={this.onMenuClose}
              animation={PopoverAnimationVertical}
            >
              <div style={{width: "25rem"}}>
                <oc-molecule-menu
                  ref={wc(
                    // Events
                    {
                      scaleValueChanged: (e)=>{this.onAmplitude(e.detail);},
                      isoValueChanged: (e) => {this.onIsoScale(e.detail);},
                      normalModeChanged: (e) => {this.onModeChange(e.detail);},
                      playChanged: (e) => {this.onPlayToggled(e.detail);},
                    },
                    // Props
                    {
                      nModes: animation.nModes,
                      iMode: animation.modeIdx,
                      scaleValue: animation.scale,
                      play: animation.play,
                      hasVolume: hasVolume,
                      isoValue: this.state.isoSurfaces[0].value,
                    })
                  }
                ></oc-molecule-menu>
              </div>
            </Popover>
          </div>
          }
        </div>
      </div>
    );
  }

  isoSurfaces(iso = 0.005) {
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

export default Molecule
