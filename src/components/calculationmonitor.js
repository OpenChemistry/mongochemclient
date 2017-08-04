import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import AutoRenew from 'material-ui/svg-icons/action/autorenew';
import Launch from 'material-ui/svg-icons/action/launch';
import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import Done from 'material-ui/svg-icons/action/done';
import Backup from 'material-ui/svg-icons/action/backup';
import Help from 'material-ui/svg-icons/action/help';


import { lightGreenA700,
         grey300,
         indigoA200,
         lightGreen200,
         red500,
         blue500,
         blue200,
} from 'material-ui/styles/colors';


import { CalculationState } from '../utils/constants'

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
      <Table
        selectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn colSpan="2" tooltip={this.props.title} style={{textAlign: 'center'}}>
              {this.props.title}
            </TableHeaderColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn tooltip="ID">ID</TableHeaderColumn>
            <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          showRowHover={true}
          displayRowCheckbox={false}
        >
          {this.props.calculations.map( (calculation, index) => (
            <TableRow key={index}>
              <TableRowColumn>{calculation.name}</TableRowColumn>
              <TableRowColumn>
                <Chip
                  backgroundColor={'#ffffff'}
                >
                  <Avatar icon={statusToStyle(calculation.status).icon} backgroundColor={statusToStyle(calculation.status).color}/>
                  {calculation.status ? calculation.status.toUpperCase() : ''}
                </Chip>
              </TableRowColumn>
            </TableRow>
            ))}
        </TableBody>
      </Table>
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
