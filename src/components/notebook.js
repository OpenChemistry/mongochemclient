import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe'

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import PageHead from './page-head';
import PageBody from './page-body';

const appStyles = theme => ({
  iframe: {
    width: '100%',
    height: '-webkit-fill-available'
  }
})

class Notebook extends Component {

   render = () => {
    const {classes, fileId} = this.props;
    const baseUrl =  `${window.location.origin}/api/v1`;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Notebook
          </Typography>
        </PageHead>
        <PageBody>
          <Iframe className={classes.iframe} url={`${baseUrl}/notebooks/${fileId}/html`}/>
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

export default withStyles(appStyles)(Notebook)