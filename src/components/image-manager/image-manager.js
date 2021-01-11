import React, { Component } from 'react';

import { Typography, withStyles } from '@material-ui/core';

import PageHead from '../page-head';
import PageBody from '../page-body';

import ImagesTable from './table';
import PullTabs from './pull-tabs';

const styles = theme => ({
  root: {
    display: 'flex'
  }
});

class ImageManager extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { images, onPull, onRegister } = this.props;

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
          <PullTabs
            onPull={onPull}
            onRegister={onRegister}
          />
          <ImagesTable
            images={images}
          />
        </PageBody>
      </div>
    );
  }
}

export default withStyles(styles)(ImageManager);
