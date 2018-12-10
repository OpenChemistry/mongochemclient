import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const CalculatedProperties = (props) => {
  const { calculatedProperties } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Value</TableCell>
          <TableCell>Units</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(calculatedProperties).map( key => (
          <TableRow key={key}>
            <TableCell>{calculatedProperties[key].label}</TableCell>
            <TableCell>{calculatedProperties[key].value.toFixed(3)}</TableCell>
            <TableCell>{calculatedProperties[key].units}</TableCell>
          </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default CalculatedProperties;
