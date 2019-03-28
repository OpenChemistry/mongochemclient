import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PageHead from './page-head';
import PageBody from './page-body';
import CardComponent from './item-card';
import { withStyles } from '@material-ui/core';
import { has } from 'lodash-es';

const style = (_theme) => ({});

class Molecules extends Component {

  render = () => {
    const {molecules, onOpen, classes} = this.props;

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
          <Grid container spacing={24}>
            {
              molecules.map(molecule => {
                const title = molecule.name ? molecule.name : 'Molecule';
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

export default withStyles(style)(Molecules);
