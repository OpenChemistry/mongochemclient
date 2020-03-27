import React, { Component } from 'react';

import { Button, TextField, Typography, withStyles } from '@material-ui/core';

import PageHead from '../page-head';
import PageBody from '../page-body';

import ImagesTable from './table';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  imageNameField: {
    margin: theme.spacing.unit,
    width: '30ch'
  },
  pullImageButton: {
    margin: theme.spacing.unit
  }
});

const defaultImageName = 'openchemistry/chemml:latest';

class ImageManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageName: defaultImageName
    };
  }

  imageType = () => {
    // FIXME: this should be set by some internal setting
    return 'Docker';
  };

  handleImageChange = event => {
    this.setState({ imageName: event.target.value });
  };

  pullImage = () => {
    const imageName = this.state.imageName;
    const type = this.imageType().toLowerCase();
    this.props.onPull(imageName, type);
  };

  render() {
    const { classes, images } = this.props;

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
          <TextField
            label="Name"
            defaultValue={defaultImageName}
            className={classes.imageNameField}
            onChange={this.handleImageChange}
            inputProps={{
              'aria-label': 'description',
              spellCheck: 'false'
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
          <ImagesTable
            images={images}
          />
        </PageBody>
      </div>
    );
  }
}

export default withStyles(styles)(ImageManager);
