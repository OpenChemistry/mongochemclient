import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import _ from 'lodash';

import PageHead from '../page-head';
import PageBody from '../page-body';
import { Paper } from '@material-ui/core';

import NotebooksTable from './table';

class Notebooks extends Component {

  render = () => {
    const {notebooks, onOpen} = this.props;
    if (!_.isNil(this.props.onCellClick)) {
      this.onCellClick = this.props.onCellClick;
    }

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Notebooks
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            Click on any notebook to be redirected to JupyterHub
          </Typography>
        </PageHead>
        <PageBody>
          <Paper>
            <NotebooksTable notebooks={notebooks} onOpen={onOpen}/>
          </Paper>
        </PageBody>
      </div>
    );
  }
}

Notebooks.propTypes = {
  notebooks: PropTypes.array
}

Notebooks.defaultProps = {
  notebooks: [],
}

export default Notebooks;
