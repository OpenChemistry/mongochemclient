import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import PageHead from '../page-head';
import PageBody from '../page-body';

import { user } from '@openchemistry/girder-ui';

class CreatorProfile extends Component {
  render () {
    const { creator } = this.props.location.state;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            {creator.login}'s Profile
          </Typography>
        </PageHead>
        <PageBody noOverlap>
          <user.CreatorProfile {...this.props}/>
        </PageBody>
      </div>
    );
  }
}

export default CreatorProfile;