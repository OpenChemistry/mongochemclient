import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe'

import Typography from '@material-ui/core/Typography';

import PageHead from './page-head';
import PageBody from './page-body';

export default class Notebook extends Component {
   render = () => {
    const {fileId} = this.props;
    const baseUrl =  `${window.location.origin}/api/v1`;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Notebook
          </Typography>
        </PageHead>
        <PageBody>
          <Iframe id='iframe' url={`${baseUrl}/notebooks/${fileId}/html`}
          width='100%'
          onLoad={function(){
            var frame = document.getElementById('iframe');
            if (frame) {
              frame.height = frame.contentWindow.document.body.scrollHeight + 'px';
            }
          }}/>
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
