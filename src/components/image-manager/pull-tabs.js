import React, { Component } from 'react';
import { Paper, AppBar, Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AdvancedPull from './advanced-pull';
import BasicPull from './basic-pull';

const styles = theme => ({
  root: {
    display: 'flex'
  }
});

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

const defaultTab = 0;

class PullTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: defaultTab
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, newValue) {
    this.setState({ tab: newValue });
  }

  render() {
    const { onPull } = this.props;

    return (
      <div>
        <Paper>
          <AppBar style={{backgroundColor:"#37474F"}} position="static">
            <StyledTabs value={this.state.tab} onChange={this.handleChange}>
              <Tab label='Basic' />
              <Tab label='Advanced' />
            </StyledTabs>
          </AppBar>
          <div hidden={this.state.tab !== 0}>
            <BasicPull
              onPull={onPull}
            />
          </div>
          <div hidden={this.state.tab !== 1}>
            <AdvancedPull
              onPull={onPull}
            />
          </div>
        </Paper>
      </div>
    );
  };
}

export default withStyles(styles)(PullTabs);
