import React from 'react';
import { Paper } from '@material-ui/core';

import { user } from '@openchemistry/girder-ui';

export default function BasicInfo() {
  return (
    <Paper style={{margin:'10px'}}>
      <user.BasicInfo />
    </Paper>
  );
}