import React, { Component, Fragment } from 'react';

import PropTypes from 'prop-types';

import { Paper, Button, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import PageHead from '../page-head';
import PageBody from '../page-body';

import NotebooksTable from './table';

const styles = theme => ({
  paper: {
    marginBottom: 2 * theme.spacing.unit
  },
  addButton: {
    float: 'right'
  },
  loading: {
    cursor: 'progress'
  }
});

class Notebooks extends Component {

  render = () => {
    const {notebooks, onOpen, redirecting, classes} = this.props;

    return (
      <div className={`${redirecting ? classes.loading : ''}`}>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Notebooks
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            Click on any notebook to be redirected to JupyterHub
          </Typography>
        </PageHead>
        <PageBody>
          <Paper className={classes.paper}>
            <NotebooksTable notebooks={notebooks} onOpen={onOpen} redirecting={redirecting}/>
          </Paper>
          <Button
            disabled={redirecting} className={classes.addButton} variant='contained'
            onClick={() => {onOpen()}}
          >
            <AddIcon/> New Notebook
          </Button>
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

export default withStyles(styles)(Notebooks);
