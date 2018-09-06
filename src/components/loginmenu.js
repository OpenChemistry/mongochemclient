import React, { Component } from 'react';
import { connect } from 'react-redux'

import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';

import { selectors } from '@openchemistry/redux';
import { jupyterlab } from '@openchemistry/redux';
import { girder } from '@openchemistry/redux';

class LoginMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
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

  handleSignOut = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.props.dispatch(jupyterlab.invalidateSession())
    this.props.dispatch(girder.invalidateToken())
  };

  render = () => {
    const {me} = this.props;

    return (
        <div>
          <IconButton onClick={this.handleTouchTap}>
            <PersonIcon/>
          </IconButton>
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            onClose={this.handleRequestClose}
            animation={PopoverAnimationVertical}
          >
            <MenuList>
              <MenuItem>
                <PersonIcon className="l-icon-btn"/>
                {me ? me.login : '' }
              </MenuItem>
              <MenuItem button onClick={this.handleSignOut}  >
                <ExitToAppIcon className="l-icon-btn"/>
                Sign out
              </MenuItem>
            </MenuList>
          </Popover>
        </div>

    );
  }
}

function mapStateToProps(state, ownProps) {
  const me = selectors.girder.getMe(state);

  return {
    me,
  }
}

export default connect(mapStateToProps)(LoginMenu)

