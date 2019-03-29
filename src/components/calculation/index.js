import React, { Component } from 'react';

import { withStyles, Grid, Card, Typography, Button } from '@material-ui/core';

import { wc } from '../../utils/webcomponent';
import { isNil, has } from 'lodash-es';

import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';

import AssignmentIcon from '@material-ui/icons/Assignment';

import CalculationNotebooksContainer from '../../containers/calculationnotebooks'
import PageHead from '../page-head';
import PageBody from '../page-body';
import CardComponent from '../item-details-card';
import { formatFormula } from '../../utils/formulas';
import { camelToSpace } from '../../utils/strings';
import { formatBasis, formatCode, formatTask, formatTheory } from '../../utils/calculations';

const styles = theme => ({
  buttonDiv: {
    position: 'relative',
    width: '100%',
  },
  button: {
    position: 'absolute',
    right: 0,
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
      moleculeProperties.push({label: 'Inchi', value: molecule.inchi});
    }
    if (has(molecule, 'smiles')) {
      moleculeProperties.push({label: 'Smiles', value: molecule.smiles});
    }

    const moleculeSection = {
      label: 'Molecule',
      properties: moleculeProperties
    };

    sections.push(moleculeSection);

    let calculationProperties = [];
    if (has(calculation, 'image.repository')) {
      calculationProperties.push({label: 'Code', value: formatCode(calculation.image.repository)});
    }
    if (has(calculation, 'input.parameters.task')) {
      calculationProperties.push({label: 'Type', value: formatTask(calculation.input.parameters.task)});
    }
    if (has(calculation, 'input.parameters.theory')) {
      calculationProperties.push({label: 'Theory', value: formatTheory(calculation.input.parameters.theory, calculation.input.parameters.functional)});
    }
    if (has(calculation, 'input.parameters.basis')) {
      calculationProperties.push({label: 'Basis', value: formatBasis(calculation.input.parameters.basis)});
    }

    const calculationSection = {
      label: 'Input',
      properties: calculationProperties
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
      properties: outputProperties
    };

    sections.push(outputSection);

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
              </Card>
              { showNotebooks &&
              <div className={classes.buttonDiv}>
                <Button variant="fab" onClick={this.handleTouchTap} className={classes.button}>
                  <AssignmentIcon/>
                </Button>
              </div>
              }
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
