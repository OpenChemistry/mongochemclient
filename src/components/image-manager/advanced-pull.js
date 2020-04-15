import React, { Component } from 'react';

import { Button, TextField, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  imagesListField: {
    margin: theme.spacing.unit,
    width: '30ch'
  },
  pullImagesButton: {
    margin: theme.spacing.unit
  }
});

const defaultImagesList = [
  'openchemistry/chemml:0.6.0',
  'openchemistry/nwchem:6.6',
  'openchemistry/psi4:1.2.1',
  'openchemistry/torchani:1.2',
];

const defaultImages = defaultImagesList.join('\n');

class AdvancedPull extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: defaultImages
    };
  }

  handleImagesListChange = event => {
    this.setState({ images: event.target.value });
  };

  pullImages = () => {
    // The images is stored a string. Break it up
    // by white space.
    const images = this.state.images.match(/\S+/g);
    images.forEach((image) => {
      this.props.onPull(image);
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <TextField
          label="Images"
          defaultValue={defaultImages}
          className={classes.imagesListField}
          onChange={this.handleImagesListChange}
          inputProps={{
            'aria-label': 'description',
            spellCheck: 'false'
          }}
          multiline
        />
        <br />
        <Button
          onClick={this.pullImages}
          className={classes.pullImagesButton}
          variant="contained"
        >
          Pull Images
        </Button>
      </div>
    );
  };
};

export default withStyles(styles)(AdvancedPull);
