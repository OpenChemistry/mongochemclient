import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PageHead from './page-head';
import PageBody from './page-body';
import { Card, CardContent, CardHeader, CardActionArea, Table, TableBody, TableRow, TableCell } from '@material-ui/core';

class Calculations extends Component {

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
                return(
                  <Grid key={calculation._id} item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardActionArea onClick={() => {onOpen(calculation._id)}} disabled={calculation.properties.pending}>
                        <CardHeader title='Calculation'></CardHeader>
                        <CardContent>
                          { calculation.properties &&
                          <div>
                            { calculation.properties.pending &&
                            <div>
                              <Typography color='textSecondary'>Completed</Typography>
                              <Typography gutterBottom>{calculation.properties.pending ? 'No' : 'Yes'}</Typography>
                            </div>
                            }
                            { calculation.properties.calculationTypes &&
                            <div>
                              <Typography color='textSecondary'>Type</Typography>
                              <Typography gutterBottom>{calculation.properties.calculationTypes[0] || calculation.properties.calculationTypes}</Typography>
                            </div>
                            }
                            { calculation.properties.theory &&
                            <div>
                              <Typography color='textSecondary'>Theory</Typography>
                              <Typography gutterBottom>{calculation.properties.theory}</Typography>
                            </div>
                            }
                            { calculation.properties.functional &&
                            <div>
                              <Typography color='textSecondary'>Functional</Typography>
                              <Typography gutterBottom>{calculation.properties.functional}</Typography>
                            </div>
                            }
                            { calculation.properties.basisSet &&
                            <div>
                              <Typography color='textSecondary'>Basis set</Typography>
                              <Typography gutterBottom>{calculation.properties.basisSet.name}</Typography>
                            </div>
                            }
                          </div>
                          }
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
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
