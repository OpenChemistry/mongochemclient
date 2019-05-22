import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PageHead from './page-head';
import PageBody from './page-body';
import CardComponent from './item-card';
import { withStyles } from '@material-ui/core';
import { formatFormula } from '../utils/formulas';
import { has } from 'lodash-es';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  }
});

class Molecules extends Component {

  sortOptions = [
    {
      label: 'Newest',
      sort: '_id',
      sortdir: -1
    },
    {
      label: 'Oldest',
      sort: '_id',
      sortdir: 1
    },
    {
      label: 'Formula (Descending)',
      sort: 'properties.formula',
      sortdir: -1
    },
    {
      label: 'Formula (Ascending)',
      sort: 'properties.formula',
      sortdir: 1
    }
  ]

  state = {
    sortBy: ''
  }

  handleOptionsChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    const val = event.target.value;
    const sort = this.sortOptions[val].sort;
    const sortdir = this.sortOptions[val].sortdir;
    const options = { limit: 25, offset: 0, sort: sort, sortdir: sortdir }
    this.props.onOptionsChange(options);
  }

  getName(molecule) {
    if (molecule.name)
      return molecule.name;
    else if (molecule.properties.formula)
      return formatFormula(molecule.properties.formula);
    return 'Molecule';
  }

  render = () => {
    const {classes, molecules, onOpen, onOptionsChange} = this.props;

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Molecules
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
        </PageHead>
        <PageBody>
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="sort-by">Sort By</InputLabel>
              <Select
                value={this.state.sortBy}
                onChange={this.handleOptionsChange}
                inputProps={{
                  name: 'sortBy',
                  id: 'sort-by',
                }}
              >
              {
                this.sortOptions.map((option, index) => {
                  return (
                    <MenuItem value={index}>{option.label}</MenuItem>
                  )
                })
              }
              </Select>
            </FormControl>
          </form>
          <Grid container spacing={24}>
            {
              molecules.map(molecule => {
                const title = this.getName(molecule);
                const image = `${window.location.origin}/api/v1/molecules/${molecule._id}/svg`;
                const properties = [];
                if (has(molecule, 'properties.atomCount')) {
                  properties.push({label: 'Atoms', value: molecule.properties.atomCount});
                }
                if (has(molecule, 'properties.mass')) {
                  properties.push({label: 'Mass', value: molecule.properties.mass.toFixed(2)});
                }

                return (
                  <Grid key={molecule._id} item xs={12} sm={6} md={4} lg={3}>
                    <CardComponent
                      title={title}
                      properties={properties}
                      image={image}
                      onOpen={() => {onOpen(molecule.inchikey)}}/>
                  </Grid>
                )
              })
            }
          </Grid>
        </PageBody>
      </div>
    );
  }
}

Molecules.propTypes = {
  molecules: PropTypes.array,
  onOpen: PropTypes.func
}

Molecules.defaultProps = {
  molecules: [],
  onOpen: () => null
}

export default withStyles(styles)(Molecules);
