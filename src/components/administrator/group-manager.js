import React, { Component } from 'react';

import { admin } from '@openchemistry/girder-ui';

class GroupManager extends Component {
  render() {
    return (
      <div>
        <admin.Groups />
      </div>
    );
  }
}

export default GroupManager;
