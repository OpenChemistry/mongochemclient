import React from 'react';
import { Paper, AppBar, Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

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

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Paper style={{margin:'10px'}}>
      <AppBar position="static">
        <StyledTabs value={value} onChange={handleChange}>
          <Tab label='Profile' />
          <Tab label='API Keys' />
        </StyledTabs>
      </AppBar>
      <div hidden={value !== 0}>
        <user.BasicInfo />
      </div>
      <div hidden={value !== 1}>
        <user.ApiKeys />
      </div>
    </Paper>
  );
}