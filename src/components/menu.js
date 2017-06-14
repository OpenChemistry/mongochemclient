import React from 'react';
import IconButton from 'material-ui/IconButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import Slider from 'material-ui/Slider';
require('font-awesome/css/font-awesome.css');


export default class MoleculeMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      amplitude: 1,
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
            <ListItem>
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

            </ListItem>
          </List>
        </Popover>
      </div>
    );
  }
}
