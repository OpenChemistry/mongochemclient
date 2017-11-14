import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe'

export default class Notebook extends Component {

   render = () => {
    const {fileId} = this.props;
    const baseUrl =  `${window.location.origin}/api/v1`;
    return (
        <Iframe url={`${baseUrl}/notebooks/${fileId}/html`}
          width="100%"
          height="85%"
          />
    );
  }
}

Notebook.propTypes = {
  fileId: PropTypes.string
}

Notebook.defaultProps = {

  fileId: null,
}

