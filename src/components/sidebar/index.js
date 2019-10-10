import React, { Component } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';

import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/FormatListBulleted';
import MemoryIcon from '@material-ui/icons/Memory';
import GroupIcon from '@material-ui/icons/GroupWork';

const style = {
  menu: {
    color: 'white',
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
  submenu: {
    paddingBottom: '1rem',
    marginLeft: '15px',
    color: 'white',
  },
  subicon: {
    fontSize: 'medium',
  }
}

class SideBar extends Component {

  render() {
    const { pushRoute, showNotebooks, userId } = this.props;
    return (
      <MenuList>

        <MenuItem
          style={style.menu}
          onClick={() => pushRoute('/') }
        >
          <HomeIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Welcome</Typography>
        </MenuItem>

        { showNotebooks && <MenuItem
            style={style.menu}
            onClick={() => pushRoute('/notebooks') }
          >
            <ListIcon color="primary" />&nbsp;
            <Typography color="inherit" variant="subheading">Notebooks</Typography>
          </MenuItem>
        }
        <MenuItem
          style={style.menu}
          onClick={() => pushRoute('/calculations') }
        >
          <MemoryIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Calculations</Typography>
        </MenuItem>

        {userId
          ? <MenuItem
            dense
            style={style.submenu}
            onClick={() => pushRoute('/user/' + userId + '/calculations') }
          >
            <MemoryIcon style={style.subicon} color="primary" />&nbsp;
            <Typography color="inherit" variant="subtitle2">My Calculations</Typography>
          </MenuItem>
          : null
        }

        <MenuItem
          dense
          style={style.menu}
          onClick={() => pushRoute('/molecules?limit=16&offset=0&sort=_id&sortdir=-1&sortIndex=0') }
        >
          <GroupIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Molecules</Typography>
        </MenuItem>

        {userId
          ? <MenuItem
            style={style.submenu}
            onClick={() => pushRoute('/user/' + userId + '/molecules?limit=16&offset=0&sort=_id&sortdir=-1&sortIndex=0') }
          >
            <GroupIcon style={style.subicon} color="primary" />&nbsp;
            <Typography color="inherit" variant="subtitle2">My Molecules</Typography>
          </MenuItem>
          : null
        }

      </MenuList>
    );
  }
}

SideBar.defaultProps = {
  showNotebooks: false,
};

export default SideBar;
