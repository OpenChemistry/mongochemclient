import React, { Component } from 'react';

import {
  withStyles, Table, TableBody, TableCell, TableHead, TableRow,
} from '@material-ui/core';

const styles = theme => {
  const ret = {
    root: {
      display: 'flex'
    }
  };
  return ret;
};

const columns = [
  {
    label: 'Repository',
    get: (v) => v.repository
  },
  {
    label: 'Tag',
    get: (v) => v.tag
  },
  {
    label: 'Size (GB)',
    get: (v) => v.docker.size
  },
  {
    label: 'Created',
    get: (v) => v.docker.timestamp
  },
];

class ImagesTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { images } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {images.map(image => (
            <TableRow key={image._id}>
              {columns.map(col => (
                <TableCell>{col.get(image)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(ImagesTable);
