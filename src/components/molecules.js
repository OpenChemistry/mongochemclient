import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PageHead from './page-head';
import PageBody from './page-body';
import { Card, CardContent, CardHeader, CardActionArea } from '@material-ui/core';

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
              molecules.map(molecule => {
                return(
                  <Grid key={molecule.id} item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardActionArea onClick={() => {onOpen(molecule.inchikey)}}>
                        <CardHeader title='Molecule'></CardHeader>
                        <CardContent>
                          { molecule.name &&
                          <div>
                            <Typography color='textSecondary'>Name</Typography>
                            <Typography>{molecule.name}</Typography>
                          </div>
                          }
                          <Typography color='textSecondary'>InChI Key</Typography>
                          <Typography>{molecule.inchikey}</Typography>
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

Molecules.propTypes = {
  molecules: PropTypes.array,
  onOpen: PropTypes.func
}

Molecules.defaultProps = {
  molecules: [],
  onOpen: () => null
}

export default Molecules;
