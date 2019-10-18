import React, { Component } from 'react';

import { Button, TextField, Typography, withStyles } from '@material-ui/core';

import ContainerSelector from './container-selector';

import PageHead from '../page-head';
import PageBody from '../page-body';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  imageNameField: {
    margin: theme.spacing.unit
  },
  pullImageButton: {
    margin: theme.spacing.unit
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
  }
];

if (process.env.OC_SITE == 'NERSC') {
  // Add shifter as an option
  const value = 2;
  const label = 'Shifter';
  containerFields.push({ value, label });
}

class ImageManager extends Component {
  constructor(props) {
    super(props);

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
    this.props.onPull(imageName, container);
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <PageHead>
          <Typography color="inherit" gutterBottom variant="display1">
            Image Manager
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            Manage your images here.
          </Typography>
        </PageHead>
        <PageBody>
          <ContainerSelector
            onChange={this.handleContainerChange}
            fields={containerFields}
          />
          <TextField
            label="Name"
            defaultValue={defaultImageName}
            className={classes.imageNameField}
            onChange={this.handleImageChange}
            inputProps={{
              'aria-label': 'description'
            }}
          />
          <br/>
          <Button
            onClick={this.pullImage}
            className={classes.pullImageButton}
            variant="contained"
          >
            Pull Image
          </Button>
        </PageBody>
      </div>
    );
  }
}

export default withStyles(styles)(ImageManager);
