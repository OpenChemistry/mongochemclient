import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PageHead from './page-head';
import PageBody from './page-body';
import { Card, CardContent, CardHeader, CardActionArea } from '@material-ui/core';
import { formatFormula } from '../utils/formulas';

class Molecules extends Component {

  render = () => {
    const {molecules, onOpen} = this.props;

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
              molecules.map(molecule =>
                <Grid key={molecule._id} item xs={12} sm={6} md={4} lg={3}>
                  <Card>
                    <CardActionArea onClick={() => {onOpen(molecule.inchikey)}}>
                      <CardHeader title={molecule.properties.formula ? formatFormula(molecule.properties.formula) : 'Molecule'}></CardHeader>
                      <CardContent>
                        { molecule.name &&
                        <div>
                          <Typography color='textSecondary'>Name</Typography>
                          <Typography>{molecule.name}</Typography>
                        </div>
                        }
                        { molecule.properties.atomCount &&
                        <div>
                          <Typography color='textSecondary'>Atoms</Typography>
                          <Typography>{molecule.properties.atomCount}</Typography>
                        </div>
                        }
                        { molecule.properties.mass &&
                        <div>
                          <Typography color='textSecondary'>Mass</Typography>
                          <Typography>{molecule.properties.mass.toFixed(2)} g/mol</Typography>
                        </div>
                        }
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              )
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

export default Molecules;
