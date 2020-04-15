import React, { Component } from 'react';

import { Button, TextField, withStyles } from '@material-ui/core';

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

class BasicPull extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageName: defaultImageName
    };
  }

  handleImageChange = event => {
    this.setState({ imageName: event.target.value });
  };

  pullImage = () => {
    this.props.onPull(this.state.imageName);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
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
        <br />
        <Button
          onClick={this.pullImage}
          className={classes.pullImageButton}
          variant="contained"
        >
          Pull Image
        </Button>
      </div>
    );
  };
};

export default withStyles(styles)(BasicPull);
