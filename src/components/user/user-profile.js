import React from 'react';
import { Paper, AppBar, Tabs, Tab, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import PageHead from '../page-head';
import PageBody from '../page-body';

import { user } from '@openchemistry/girder-ui';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      width: '100%',
      backgroundColor: '#ffffff',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

export default function UserProfile() {
  const [value, setValue] = React.useState(0);
  let scopeOptions = ['read', 'write'];

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div>
      <PageHead>
        <Typography  color="inherit" gutterBottom variant="display1">
          User Settings
        </Typography>
        <Typography variant="subheading" paragraph color="inherit">
        </Typography>
      </PageHead>
      <PageBody>
        <Paper>
          <AppBar style={{backgroundColor:"#37474F"}} position="static">
            <StyledTabs value={value} onChange={handleChange}>
              <Tab label='Profile' />
              <Tab label='API Keys' />
            </StyledTabs>
          </AppBar>
          <div hidden={value !== 0}>
            <user.BasicInfo />
          </div>
          <div hidden={value !== 1}>
            <user.ApiKeys scopeOptions={scopeOptions}/>
          </div>
        </Paper>
      </PageBody>
    </div>
  );
}
