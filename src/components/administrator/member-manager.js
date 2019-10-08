import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

import PageHead from '../page-head';
import PageBody from '../page-body';

import { admin } from '@openchemistry/girder-ui';

class MemberManager extends Component {
  render() {
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Group Members
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
        </PageHead>
        <PageBody>
          <admin.Members />
          <admin.AddUser />
          <admin.Users />
        </PageBody>
      </div>
    );
  }
}

export default MemberManager;
