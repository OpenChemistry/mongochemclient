import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { has, filter, eq } from 'lodash-es';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PageHead from './page-head';
import PageBody from './page-body';
import CardComponent from './item-card';
import { formatFormula } from '../utils/formulas';
import { getCalculationProperties } from '../utils/calculations';

const styles = theme => ({
  grid: {
    marginTop: 1.5 * theme.spacing.unit,
    marginBottom: 1.5 * theme.spacing.unit
  }
});

class Calculations extends Component {

  getName(calculation) {
    const { molecules } = this.props;
    if (molecules && calculation.moleculeId in molecules) {
      if (molecules[calculation.moleculeId].name)
        return molecules[calculation.moleculeId].name;
      else if (molecules[calculation.moleculeId].properties.formula)
        return formatFormula(molecules[calculation.moleculeId].properties.formula);
    }
    return 'Calculation';
  }

  render = () => {
    const {calculations, onOpen, before, after, classes} = this.props;

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Calculations
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
        </PageHead>
        <PageBody>
          {before}
          <Grid container spacing={24} className={classes.grid}>
            {
              calculations.map(calculation => {
                const title = this.getName(calculation);
                const image = `${window.location.origin}/api/v1/molecules/${calculation.moleculeId}/svg`;
                const pending = has(calculation, 'properties.pending');
                let properties = getCalculationProperties(calculation);
                properties = filter(properties, function(obj) {
                  return !eq(obj.label, 'Version');
                  });

                return (
                  <Grid key={calculation._id} item xs={12} sm={6} md={4} lg={3}>
                    <CardComponent
                      title={title}
                      properties={properties}
                      image={image}
                      disabled={pending}
                      onOpen={() => {onOpen(calculation._id)}}/>
                  </Grid>
                )
              })
            }
          </Grid>
          {after}
        </PageBody>
      </div>
    );
  }
}

Calculations.propTypes = {
  calculations: PropTypes.array,
  onOpen: PropTypes.func
}

Calculations.defaultProps = {
  calculations: [],
  onOpen: () => null
}

export default withStyles(styles)(Calculations);
