import React, { Component } from 'react';
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

import selectors from '../redux/selectors';
import { invalidateToken } from '../redux/ducks/girder'
import { invalidateSession } from '../redux/ducks/jupyterlab'

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

    this.props.dispatch(invalidateSession())
    this.props.dispatch(invalidateToken())
  };

  render = () => {
    const {me} = this.props;

    return (
        <div>
          <FlatButton
            label={me ? me.login : '' }
            onClick={this.handleTouchTap}
            labelPosition='before'
            icon={<NavigationArrowDropDown />} />
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
            animation={PopoverAnimationVertical}
          >
            <Menu>
              <MenuItem primaryText='Sign out' leftIcon={<ActionExitToApp/>}
                        onClick={this.handleSignOut}  />
            </Menu>
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

