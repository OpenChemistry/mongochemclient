import React, { Component } from 'react';

import { admin } from '@openchemistry/girder-ui';

import { Paper } from '@material-ui/core';

class GroupManager extends Component {
  render() {
    return (
      <div>
        <admin.Groups />
        <admin.Members />
        <admin.AddUser />
        <admin.Users />
      </div>
    );
  }
}

export default GroupManager;
