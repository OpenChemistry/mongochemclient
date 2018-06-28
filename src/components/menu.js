import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';

import PropTypes from 'prop-types';
import './menu.css'

export default class MoleculeMenu extends React.Component {

  dragCount = 0;

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      amplitude: props.animation && props.animation.scale ? props.animation.scale : 1.0,
      isoScale: 42,
    };

    if (props.isoValue) {
      this.state.isoValue = props.isoValue;
      this.state.isoScale = (props.isoValue * 2000) -1;
    }

    if (props.orbital) {
      this.state.orbital = props.orbital;
    }
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleAmplitudeSliderOnChange = (event, value) => {
    this.setState({amplitude: value});
    this.dragCount += 1;
    let myCount = this.dragCount;
    setTimeout(()=>{
      if (this.dragCount === myCount && this.props.onAmplitude) {
        this.props.onAmplitude(this.state.amplitude);
      }
    }, 200);
  };

  handleIsoScaleSliderOnChange = (event, value) => {
    this.setState({
      isoScale: value,
      isoValue: (this.state.isoScale + 1) / 2000.0,
    });
    this.dragCount += 1;
    let myCount = this.dragCount;
    setTimeout(()=>{
      if (this.dragCount === myCount && this.props.onIsoScale) {
        this.props.onIsoScale(this.state.isoScale);
      }
    }, 200);
  };

  handleOrbitalChanged = (event, index, value) => {
    this.setState({
      orbital: value
    })
    if (this.props.onOrbital) {
      this.props.onOrbital(value);
    }
  };

  handleModeChange = (event) => {
    if (this.props.onModeChange) {
      // console.log(event, event.target.value);
      this.props.onModeChange(event.target.value);
    }
  };

  render() {
    const normalModeItems = [];
    normalModeItems.push(<MenuItem key={-1} value={-1}>None</MenuItem>);
    if (this.props.animation) {
      for (let i = 0; i < this.props.animation.nModes; ++i) {
        normalModeItems.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
      }
    }

    const orbitalMenuItems = [];

    if (this.props.orbitals) {
      let homo = null, lumo = null;
      for (let orbital of this.props.orbitals) {
        console.log("Orbital: ", orbital);
        orbitalMenuItems.push(<MenuItem value={orbital.id}>{orbital.label}</MenuItem>);
        if (orbital.label.indexOf('HOMO') !== -1) {
          homo = orbital.id;
        }
        if (orbital.label.indexOf('LUMO') !== -1) {
          lumo = orbital.id;
        }
      }
      if (homo &&
          lumo &&
          this.state.orbital &&
          !Number.isInteger(this.state.orbital)) {
        if (this.state.orbital.toLowerCase() === 'homo') {
          this.setState({
            orbital: homo
          });
        }
        else if (this.state.orbital.toLowerCase() === 'lumo') {
          this.setState({
            orbital: lumo
          });
        }
      }
    }

    return (
      <div>
        <IconButton onClick={this.handleTouchTap}>
          <MoreVertIcon/>
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          onClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <List style={{width: 300}}>
          { this.props.animation &&
            <div>
            <ListItem className="full-width">
              <FormControl className="full-width">
                <InputLabel>Normal mode</InputLabel>
                <Select
                  value={this.props.animation.modeIdx}
                  onChange={this.handleModeChange}
                >
                  {normalModeItems}
                </Select>
              </FormControl>
              <IconButton>
                { this.props.animation.play
                ? <PauseIcon onClick={()=>{ if (this.props.onPlayToggled) {this.props.onPlayToggled(false);} }}/>
                : <PlayIcon  onClick={()=>{ if (this.props.onPlayToggled) {this.props.onPlayToggled(true);} }}/>
                }
                </IconButton>
            </ListItem>
            <ListItem>
              <div className="full-width">
                <Typography id="animation-label" color="primary">Animation Scale: {this.state.amplitude.toFixed(1)}</Typography>
                <Slider
                  disabled={!this.props.animation.play}
                  aria-labelledby="animation-label"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={this.state.amplitude}
                  onChange={this.handleAmplitudeSliderOnChange}
                />
              </div>
            </ListItem>
            </div>
          }
          {this.props.orbitalControls &&
            <ListItem >
              <div className="full-width">
                <Typography id="isovalue-label" color="primary">Isovalue: {this.state.isoValue.toFixed(4)}</Typography>
                <Slider
                  aria-labelledby="isovalue-label"
                  min={0}
                  max={100}
                  step={1}
                  value={this.state.isoScale}
                  onChange={this.handleIsoScaleSliderOnChange}
                />
              </div>
          </ListItem>
          }
          {this.props.orbitalControls && this.state.orbital &&
            <ListItem>
              <Select
                value={this.state.orbital}
                onChange={this.handleOrbitalChanged}>
                {orbitalMenuItems}
              </Select>
            </ListItem>
          }
          </List>
        </Popover>
      </div>
    );
  }
}

MoleculeMenu.propTypes = {
  animation: PropTypes.object,
  orbitalControls: PropTypes.bool,
  orbitals: PropTypes.array,
}

MoleculeMenu.defaultProps = {
  animation: {play: false, modeIdx: -1, scale: 1},
  orbitalControls: false,
  orbitals: null,
}
