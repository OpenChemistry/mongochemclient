import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import AccessTime from '@material-ui/icons/AccessTime';
import AutoRenew from '@material-ui/icons/Autorenew';
import Backup from '@material-ui/icons/Backup';
import Done from '@material-ui/icons/Done';
import Help from '@material-ui/icons/Help';
import Launch from '@material-ui/icons/Launch';
import ReportProblem from '@material-ui/icons/ReportProblem';

import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import lightGreen from '@material-ui/core/colors/lightGreen';
import red from '@material-ui/core/colors/red';

import { CalculationState } from '../utils/constants';

const blue200 = blue['200'];
const blue500 = blue['500'];
const red500 = red['500'];
const lightGreen200 = lightGreen['200'];
const lightGreenA700 = lightGreen['A700'];
const grey300 = grey['300'];
const indigoA200 = indigo['A200'];

const statusToStyle = (status) => {
    const iconMap = {
      [CalculationState.initializing.name]: {
        icon: <Launch/>,
        color: indigoA200,
      },
      [CalculationState.queued.name]: {
        icon: <AccessTime/>,
        color: lightGreen200,
      },
      [CalculationState.running.name]: {
        icon: <AutoRenew/>,
        color: lightGreenA700
      },
      [CalculationState.error.name]: {
        icon: <ReportProblem/>,
        color: red500,
      },
      [CalculationState.complete.name]: {
        icon: <Done/>,
        color: blue500,
      },
      [CalculationState.uploading.name]: {
        icon: <Backup/>,
        color: blue200,
      }
    };

    if (status in iconMap) {
      return iconMap[status]
    }
    else {
      return {
        icon: <Help/>,
        color: grey300
      }
    }
}


class CalculationMonitorTable extends Component {
  render() {
    return (
      <div>
        <h2 style={{textAlign: 'center'}}>{this.props.title}</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell tooltip="ID">ID</TableCell>
              <TableCell tooltip="Code">Code</TableCell>
              <TableCell tooltip="Type">Type</TableCell>
              <TableCell tooltip="The Status">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.calculations.map( (calculation, index) => (
              <TableRow key={index}>
                <TableCell>{calculation.name}</TableCell>
                <TableCell>{calculation.code ? calculation.code : 'N/A'}</TableCell>
                <TableCell>{calculation.type ? calculation.type : 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    avatar={
                      <Avatar style={{backgroundColor: statusToStyle(calculation.status).color}}>
                        {statusToStyle(calculation.status).icon}
                      </Avatar>
                    }
                    label={calculation.status ? calculation.status.toUpperCase() : ''}
                  />
                </TableCell>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

CalculationMonitorTable.propTypes = {
  calculations: PropTypes.array,
  title: PropTypes.string,
}

CalculationMonitorTable.defaultProps = {
  calculations: [],
  title: 'Pending Calculations'
}

export default CalculationMonitorTable
