import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles, Grid, Card, Typography, Link } from '@material-ui/core';

import { has, isNil } from 'lodash-es';

import PageHead from './page-head';
import PageBody from './page-body';
import CardComponent from './item-details-card';

import { formatFormula } from '../utils/formulas';
import { has3dCoords } from '../utils/molecules';

import { wc } from '../utils/webcomponent';
import { getCalculationProperties } from '../utils/calculations';
import { toUpperCase } from '../utils/strings';
import DownloadSelector from './download-selector';
import CollapsibleCard from './collapsible-card';

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

  getMoleculeView(molecule, classes) {
    if (has3dCoords(molecule)) {
      return (
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
      )
    }
    else {
      const src = `${window.location.origin}/api/v1/molecules/${molecule._id}/svg`
      return (
        <img src={src} class={classes.moleculeContainer}/>
      )
    }
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

  formatLink = (props) => {
    return <Link target="_blank" rel="noopener" href={props.wikipediaUrl}>
      {!isNil(props.name) ? props.name : 'Wikipedia Page'}
    </Link>
  }

  render = () => {
    const {molecule, calculations, onCalculationClick, creator, onCreatorClick, classes} = this.props;

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
      moleculeProperties.push({label: 'InChi', value: molecule.inchi});
    }
    if (has(molecule, 'smiles')) {
      moleculeProperties.push({label: 'SMILES', value: molecule.smiles});
    }
    if (has(molecule, 'wikipediaUrl')) {
      moleculeProperties.push({
        label: 'Wikipedia',
        value: this.formatLink(molecule)
      });
    }

    const moleculeSection = {
      label: 'Molecule Properties',
      items: [
        {properties: moleculeProperties}
      ]
    };

    sections.push(moleculeSection);

    const calculationsSection = {
      label: 'Calculations',
      items: calculations.map(calculation => ({
        properties: getCalculationProperties(calculation),
        onClick: () => {onCalculationClick(calculation)}
      }))
    }

    sections.push(calculationsSection);

    let creatorName = [];
    if (has(creator, 'firstName')) {
      creatorName.push({label: 'First', value: creator.firstName});
    } else {
      creatorName.push({label: 'First', value:'Unknown'});
    }
    if (has(creator, 'lastName')) {
      creatorName.push({label: 'Last', value: creator.lastName});
    } else {
      creatorName.push({label: 'Last', value: 'Unknown'});
    }
    const creatorSection = {
      label: 'Creator',
      items: [
        {
          properties: creatorName,
          onClick: () => {onCreatorClick(creator)}
        }
      ]
    }

    sections.push(creatorSection);

    const fileFormats = ['cjson', 'xyz', 'sdf', 'cml'];
    const fileOptions = fileFormats.map(format => ({
      label: toUpperCase(format),
      downloadUrl: `/api/v1/molecules/${molecule._id}/${format}`,
      fileName: `molecule.${format}`
    }));

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
                {this.getMoleculeView(molecule, classes)}
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              {sections.map((section, i) =>
                <CardComponent
                  key={i}
                  title={section.label}
                  items={section.items}
                  collapsed={section.collapsed}
                />
              )}
              <CollapsibleCard title='Download Data'>
                <DownloadSelector options={fileOptions}/>
              </CollapsibleCard>
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
