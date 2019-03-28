import React, { Component } from 'react';

import { withStyles, CardHeader, IconButton, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import { wc } from '../../utils/webcomponent';
import { isNil, has } from 'lodash-es';

import Button from '@material-ui/core/Button';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';
import Collapse from '@material-ui/core/Collapse';

import AssignmentIcon from '@material-ui/icons/Assignment';
import KeyBoardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import CalculationNotebooksContainer from '../../containers/calculationnotebooks'
import PageHead from '../page-head';
import PageBody from '../page-body';
import CalculatedProperties from './calculated-properties';

const styles = theme => ({
  buttonDiv: {
    position: 'relative',
    width: '100%',
  },
  button: {
    position: 'absolute',
    right: 0,
    bottom: 3 * theme.spacing.unit,
    right: 3 * theme.spacing.unit
  },
  popover: {
    width: 80 * theme.spacing.unit,
    maxWidth: '100%'
  },
  moleculeContainer: {
    height: 80 * theme.spacing.unit,
    width: '100%'
  },
  propertiesContainer: {
    marginBottom: 3 * theme.spacing.unit
  }
});

class Calculation extends Component {

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
      cjson,
      onIOrbitalChanged,
      id,
      calculationProperties,
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
    const { calculatedProperties } = cjson;
    const { open, openProps, anchorEl } = this.state;
    let iOrbital = mo;
    if (isNil(iOrbital)) {
      iOrbital = -1;
    }
    let energyIdx = -1;
    if (has(calculationProperties, 'calculations')) {
      energyIdx = calculationProperties.calculations.findIndex((val) => has(val, 'totalEnergy'));
    }
    return(
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            {molecule && molecule.name ? molecule.name : 'Calculation'}
          </Typography>
          { (molecule && molecule.properties.atomCount) &&
          <Typography variant="subheading" paragraph color="inherit">
            Atoms: {molecule.properties.atomCount}
          </Typography>
          }
          { (molecule && molecule.properties.mass) &&
          <Typography variant="subheading" paragraph color="inherit">
            Mass: {molecule.properties.mass.toFixed(2)} g/mol
          </Typography>
          }
          {has(calculationProperties, 'runDate') &&
          <Typography variant="subheading" paragraph color="inherit">
            Date: {calculationProperties.runDate}
          </Typography>
          }
          {has(calculationProperties, 'code') &&
          <Typography variant="subheading" paragraph color="inherit">
            Program: {calculationProperties.code}
          </Typography>
          }
          {has(calculationProperties, 'friendlyName') &&
          <Typography variant="subheading" paragraph color="inherit">
            Theory: {calculationProperties.friendlyName}
          </Typography>
          }
          {energyIdx !== -1 &&
          <Typography variant="subheading" paragraph color="inherit">
            Total Energy:&nbsp;
            {calculationProperties.calculations[energyIdx].totalEnergy.value.toFixed(6)}&nbsp;
            {calculationProperties.calculations[energyIdx].totalEnergy.units}
          </Typography>
          }
        </PageHead>
        <PageBody>
          {calculatedProperties &&
          <Card className={classes.propertiesContainer}>
            <CardHeader subheader='Predicted Properties' action={
              <IconButton
                onClick={() => {this.setState({openProps: !openProps})}}
              >
                {openProps ? <KeyboardArrowUp/> : <KeyBoardArrowDown/>}
              </IconButton>
            }></CardHeader>
            <Collapse in={openProps}>
              <CardContent>
                <CalculatedProperties calculatedProperties={calculatedProperties}/>
              </CardContent>
            </Collapse>
          </Card>
          }
          <Card className={classes.moleculeContainer}>
            <oc-molecule
              ref={wc(
                // Events
                {
                  iOrbitalChanged: onIOrbitalChanged
                },
                //Props
                {
                  cjson,
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
