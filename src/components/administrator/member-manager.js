import React, { Component } from 'react';

import { admin } from '@openchemistry/girder-ui';

class MemberManager extends Component {
  render() {
    return (
      <div>
        <admin.Members />
        <admin.AddUser />
        <admin.Users />
      </div>
    );
  }
}

export default MemberManager;
