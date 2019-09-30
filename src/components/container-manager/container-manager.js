import React, { Component } from 'react';

import { Button, Input, Typography, withStyles } from '@material-ui/core';

import ContainerSelector from './container-selector';

import PageHead from '../page-head';
import PageBody from '../page-body';

const styles = theme => ({
  root: {
    display: 'flex'
  }
});

const defaultImageName = 'openchemistry/chemml';
const defaultContainerIndex = 0;

const containerFields = [
  {
    value: 0,
    label: 'Docker'
  },
  {
    value: 1,
    label: 'Singularity'
  },
  {
    value: 2,
    label: 'Shifter'
  }
];

class ContainerManager extends Component {
  constructor(props) {
    super(props);

    const { onPull } = props;
    this.onPull = onPull;

    this.state = {
      imageName: defaultImageName,
      containerIndex: defaultContainerIndex
    };
  }

  containerName = () => {
    const res = containerFields.find(e => e.value == this.state.containerIndex);
    return res.label;
  };

  handleImageChange = event => {
    this.setState({ imageName: event.target.value });
  };

  handleContainerChange = event => {
    this.setState({ containerIndex: event.target.value });
  };

  pullImage = () => {
    const imageName = this.state.imageName;
    const container = this.containerName().toLowerCase();
    this.onPull(imageName, container);
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <PageHead>
          <Typography color="inherit" gutterBottom variant="display1">
            Container Manager
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            Manage your containers here.
          </Typography>
        </PageHead>
        <PageBody>
          <ContainerSelector
            onChange={this.handleContainerChange}
            fields={containerFields}
          />
          <Input
            defaultValue={defaultImageName}
            onChange={this.handleImageChange}
            inputProps={{
              'aria-label': 'description'
            }}
          />
          <Button
            onClick={this.pullImage}
            className={classes.addButton}
            variant="contained"
          >
            Pull Image
          </Button>
        </PageBody>
      </div>
    );
  }
}

export default withStyles(styles)(ContainerManager);
