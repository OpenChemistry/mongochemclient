import React from 'react';
import IconButton from 'material-ui/IconButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import Slider from 'material-ui/Slider';
require('font-awesome/css/font-awesome.css');
import PropTypes from 'prop-types';

export default class MoleculeMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      amplitude: 1,
      isoScale: 42,
    };
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
  };

  handleAmplitudeSliderOnDragStop = (event) => {
    if (this.props.onAmplitude) {
      this.props.onAmplitude(this.state.amplitude);
    }
  };

  handleIsoScaleSliderOnChange = (event, value) => {
    this.setState({isoScale: value});
  };

  handleIsoScaleSliderOnDragStop = (event) => {
    if (this.props.onIsoScale) {
      this.props.onIsoScale(this.state.isoScale);
    }
  };

  render() {
    return (
      <div>
       <IconButton iconClassName="fa-bars"  onTouchTap={this.handleTouchTap} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <List>
            {this.props.animationControls && <ListItem>
              <p>
                <span>{'Animation Amplitude: '}</span>
                <span>{this.state.amplitude}</span>
              </p>
              <Slider
                min={1}
                max={5}
                step={1}
                value={this.state.amplitude}
                onChange={this.handleAmplitudeSliderOnChange}
                onDragStop={this.handleAmplitudeSliderOnDragStop}
              />
            </ListItem>}
            {this.props.orbitalControls && <ListItem>
              <p>
                <span>{'Isovalue: '}</span>
                <span>{((this.state.isoScale + 1) / 2000.0).toFixed(4)}</span>
              </p>
              <Slider
                min={0}
                max={100}
                step={1}
                value={this.state.isoScale}
                onChange={this.handleIsoScaleSliderOnChange}
                onDragStop={this.handleIsoScaleSliderOnDragStop}
              />
          </ListItem>}
          </List>
        </Popover>
      </div>
    );
  }
}

MoleculeMenu.propTypes = {
  animationControls: PropTypes.boolean,
  orbitalControls: PropTypes.boolean,
}

MoleculeMenu.defaultProps = {
  animationControls: false,
  orbitalControls: false,
}
