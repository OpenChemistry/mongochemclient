import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { has } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PageHead from './page-head';
import PageBody from './page-body';
import CardComponent from './item-card';
import { formatFormula } from '../utils/formulas';
import { formatCode, formatBasis, formatTheory, formatTask } from '../utils/calculations';

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
    const {calculations, onOpen} = this.props;

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
          <Grid container spacing={24}>
            {
              calculations.map(calculation => {
                const title = this.getName(calculation);
                const image = `${window.location.origin}/api/v1/molecules/${calculation.moleculeId}/svg`;
                const pending = has(calculation, 'properties.pending');
                const properties = [];
                if (has(calculation, 'image.repository')) {
                  properties.push({label: 'Code', value: formatCode(calculation.image.repository)});
                }
                if (has(calculation, 'input.parameters.task')) {
                  properties.push({label: 'Type', value: formatTask(calculation.input.parameters.task)});
                }
                if (has(calculation, 'input.parameters.theory')) {
                  properties.push({label: 'Theory', value: formatTheory(calculation.input.parameters.theory, calculation.input.parameters.functional)});
                }
                if (has(calculation, 'input.parameters.basis')) {
                  properties.push({label: 'Basis', value: formatBasis(calculation.input.parameters.basis)});
                }

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

export default Calculations;
