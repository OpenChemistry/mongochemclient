import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles, Grid, Card, Typography } from '@material-ui/core';

import { has } from 'lodash-es';

import PageHead from './page-head';
import PageBody from './page-body';
import CardComponent from './item-details-card';

import { formatFormula } from '../utils/formulas';

import { wc } from '../utils/webcomponent';

const styles = theme => ({
  moleculeContainer: {
    height: 80 * theme.spacing.unit,
    width: '100%',
    marginBottom: 2 * theme.spacing.unit
  }
});

class Molecule extends Component {

  getName(molecule) {
    if (molecule.name)
      return molecule.name;
    else if (molecule.properties.formula)
      return formatFormula(molecule.properties.formula);
    return 'Molecule';
  }

  constructor(props) {
    super(props);
    this.state = {
      rotate: false
    }
  }

  onInteract = () => {
    if (this.state.rotate) {
      this.setState({...this.state, rotate: false});
    }
  }

  render = () => {
    const {molecule, classes} = this.props;

    const sections = [];
    let moleculeProperties = [];
    if (has(molecule, 'properties.formula')) {
      moleculeProperties.push({label: 'Formula', value: formatFormula(molecule.properties.formula)});
    }
    if (has(molecule, 'properties.atomCount')) {
      moleculeProperties.push({label: 'Atoms', value: molecule.properties.atomCount});
    }
    if (has(molecule, 'properties.mass')) {
      moleculeProperties.push({label: 'Mass', value: molecule.properties.mass.toFixed(2)});
    }
    if (has(molecule, 'inchi')) {
      moleculeProperties.push({label: 'Inchi', value: molecule.inchi});
    }
    if (has(molecule, 'smiles')) {
      moleculeProperties.push({label: 'Smiles', value: molecule.smiles});
    }

    const moleculeSection = {
      label: 'Molecule Properties',
      properties: moleculeProperties
    };

    sections.push(moleculeSection);

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            {this.getName(molecule)}
          </Typography>
        </PageHead>
        <PageBody>
        <Grid container spacing={24}>
            <Grid item xs={12} sm={12} md={8}>
              <Card className={classes.moleculeContainer}>
                <oc-molecule
                  ref={wc(
                    // Events
                    {},
                    //Props
                    {
                      cjson: molecule.cjson,
                      rotate: this.state.rotate,
                      moleculeRenderer: 'moljs'
                    }
                  )}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              {sections.map((section, i) => 
                <CardComponent
                  key={i}
                  title={section.label}
                  properties={section.properties}
                />
              )}
            </Grid>
          </Grid>
        </PageBody>
      </div>
    );
  }
}

Molecule.propTypes = {
  molecule: PropTypes.object
}

Molecule.defaultProps = {
  molecule: null
}

export default withStyles(styles)(Molecule);
