import React, { Component } from 'react';

import { Button, TextField, withStyles } from '@material-ui/core';

import RegisterButton from './register-button';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  imageNameField: {
    margin: theme.spacing.unit,
    width: '30ch'
  },
  buttons: {
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

  registerImages = () => {
    this.props.onRegister();
  }

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
          className={classes.buttons}
          variant="contained"
        >
          Pull Image
        </Button>
        <RegisterButton
          onClick={this.registerImages}
          className={classes.buttons}
          variant="contained"
        >
          Register
        </RegisterButton>
      </div>
    );
  };
};

export default withStyles(styles)(BasicPull);
