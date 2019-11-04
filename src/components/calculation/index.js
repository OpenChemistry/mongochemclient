import React, { Component } from 'react';

import { withStyles, Grid, Card, Typography, Fab } from '@material-ui/core';

import { wc } from '../../utils/webcomponent';
import { isNil, has } from 'lodash-es';

import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';

import AssignmentIcon from '@material-ui/icons/Assignment';

import CalculationNotebooksContainer from '../../containers/calculationnotebooks'
import PageHead from '../page-head';
import PageBody from '../page-body';
import CardComponent from '../item-details-card';
import { formatFormula } from '../../utils/formulas';
import { has3dCoords } from '../../utils/molecules';
import { camelToSpace, toUpperCase } from '../../utils/strings';
import { getCalculationProperties } from '../../utils/calculations';
import DownloadSelector from '../download-selector';
import CollapsibleCard from '../collapsible-card';

const styles = theme => ({
  buttonDiv: {
    position: 'relative',
    width: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 5 * theme.spacing.unit,
    right: 3 * theme.spacing.unit
  },
  popover: {
    width: 80 * theme.spacing.unit,
    maxWidth: '100%'
  },
  moleculeContainer: {
    height: 80 * theme.spacing.unit,
    width: '100%',
    marginBottom: 2 * theme.spacing.unit
  }
});

class Calculation extends Component {

  getName(molecule) {
    if (molecule) {
      if (molecule.name)
        return molecule.name;
      else if (molecule.properties.formula)
        return formatFormula(molecule.properties.formula);
    }
    return 'Calculation';
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openProps: true
    }
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    const {
      calculation,
      cube,
      onIOrbitalChanged,
      onMoleculeClick,
      id,
      showNotebooks,
      molecule,
      classes,
      moleculeRenderer,
      showIsoSurface,
      showVolume,
      showSpectrum,
      showMenu,
      isoValue,
      mode,
      mo,
      play,
      colors,
      colorsX,
      opacities,
      opacitiesX
    } = this.props;

    const cjson = calculation.cjson;

    const { open, anchorEl } = this.state;
    let iOrbital = mo;
    if (isNil(iOrbital)) {
      iOrbital = -1;
    }

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

    const moleculeSection = {
      label: 'Molecule',
      items: [
        {
          properties: moleculeProperties,
          onClick: () => {onMoleculeClick(molecule)}
        }
      ]
    };

    sections.push(moleculeSection);

    let calculationProperties = getCalculationProperties(calculation);

    const calculationSection = {
      label: 'Input',
      items: [
        {properties: calculationProperties}
      ]
    };

    sections.push(calculationSection);

    let outputProperties = Object.entries(cjson.properties || {}).map(([key, value]) => {
      try {
        value = value.toFixed(4);
      } catch {

      }

      return {
        label: camelToSpace(key),
        value: value
      }
    });

    const outputSection = {
      label: 'Output',
      items: [
        {properties: outputProperties}
      ]
    };

    sections.push(outputSection);

    const fileFormats = ['cjson', 'xyz'];
    const fileOptions = fileFormats.map(format => ({
      label: toUpperCase(format),
      downloadUrl: `/api/v1/calculations/${calculation._id}/${format}`,
      fileName: `calculation.${format}`
    }));

    const {scratchFolderId} = calculation;
    if (scratchFolderId) {
      fileOptions.push({
        label: 'raw',
        downloadUrl: `/api/v1/folder/${scratchFolderId}/download`,
        fileName: 'calculation.zip'
      })
    }

    function getMoleculeView() {
      // For some reason, the molecule is sometimes null
      // Do a check here to prevent a javascript error
      if (molecule === null)
        return;

      if (has3dCoords(molecule)) {
        return (
          <oc-molecule
            ref={wc(
              // Events
              {
                iOrbitalChanged: onIOrbitalChanged
              },
              //Props
              {
                cjson: {...cjson, cube},
                orbitalSelect: true,
                moleculeRenderer,
                showIsoSurface,
                showVolume,
                showSpectrum,
                showMenu,
                isoValue,
                iOrbital,
                iMode: mode,
                play,
                colors,
                colorsX,
                opacities,
                opacitiesX
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

    return(
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
                {getMoleculeView()}
              </Card>
              { showNotebooks &&
              <div className={classes.buttonDiv}>
                <Fab onClick={this.handleTouchTap} className={classes.button}>
                  <AssignmentIcon/>
                </Fab>
              </div>
              }
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

          <Popover
            open={open}
            anchorEl={anchorEl}
            transformOrigin={{vertical: 'bottom', horizontal: 'right'}}
            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
            onClose={this.handleRequestClose}
            animation={PopoverAnimationVertical}
          >
            <div className={classes.popover}>
              <CalculationNotebooksContainer
                calculationId={id}
              />
            </div>
          </Popover>
        </PageBody>
      </div>
    );
  }
}

export default withStyles(styles)(Calculation);
