import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import { wc } from '../utils/webcomponent';
import { isNil, has } from 'lodash-es';

import Button from '@material-ui/core/Button';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';

import AssignmentIcon from '@material-ui/icons/Assignment';

import CalculationNotebooksContainer from '../containers/calculationnotebooks'
import PageHead from './page-head';
import PageBody from './page-body';
import { formatFormula } from '../utils/formulas';


class Calculation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
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
    const style = {
      buttonDiv: {
        position: 'relative',
        width: '100%',
      },
      button: {
        position: 'absolute',
        right: 0,
        bottom: '1.5rem',
        right: '1.5rem'
      },
      popover: {
        width: "40rem",
        maxWidth: '100%'
      }
    };
    const {cjson, onIOrbitalChanged, id, calculationProperties, showNotebooks, molecule} = this.props;
    let { iOrbital } = this.props;
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
            {molecule && molecule.properties.formula ? formatFormula(molecule.properties.formula) : 'Calculation'}
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
          <Card>
            <div style={{height: '40rem', width: '100%'}}>
                <oc-molecule
                  ref={wc(
                    // Events
                    {
                      iOrbitalChanged: onIOrbitalChanged
                    },
                    //Props
                    {
                      cjson: cjson,
                      moleculeRenderer: 'moljs',
                      orbitalSelect: true,
                      iOrbital: iOrbital
                    }
                  )}
                />
            </div>
          </Card>
          { showNotebooks &&
          <div style={style.buttonDiv}>
            <Button variant="fab" onClick={this.handleTouchTap} style={style.button}>
              <AssignmentIcon/>
            </Button>
          </div>
          }

          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            transformOrigin={{vertical: 'bottom', horizontal: 'right'}}
            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
            onClose={this.handleRequestClose}
            animation={PopoverAnimationVertical}
          >
            <div style={style.popover}>
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

export default Calculation;
