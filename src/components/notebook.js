import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe'

import { Typography, withStyles } from '@material-ui/core';

import PageHead from './page-head';
import PageBody from './page-body';

const styles = () => ({
  iframe: {
    border: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width:'100%',
    height:'100%'
  },
  container: {
    overflow: 'hidden',
    position: 'relative',
    paddingTop: '72%'
  }
});

class Notebook extends Component {
   render = () => {
    const { fileId, classes } = this.props;
    const baseUrl =  `${window.location.origin}/api/v1`;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Notebook
          </Typography>
        </PageHead>
        <PageBody>
        <div className={classes.container}>
          <Iframe id='iframe' url={`${baseUrl}/notebooks/${fileId}/html`}
          className={classes.iframe}/>
        </div>
        </PageBody>
      </div>
    );
  }
}

Notebook.propTypes = {
  fileId: PropTypes.string
}

Notebook.defaultProps = {

  fileId: null,
}

export default withStyles(styles)(Notebook)