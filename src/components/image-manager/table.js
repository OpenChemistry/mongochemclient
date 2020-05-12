import React, { Component } from 'react';
import { formatIsoString } from '../../utils/dates';

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
    get: (v) => formatIsoString(v.docker.timestamp)
  },
];

class ImagesTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { images } = this.props;

    // These are the 25 most recent images created.
    // Sort them by repo and tag for the table.
    images.sort((a, b) => {
      if (a.repository == b.repository) {
        if (a.tag == b.tag) {
          return 0;
        }
        return a.tag < b.tag ? -1 : 1;
      }
      return a.repository < b.repository ? -1 : 1;
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={col.label}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {images.map(image => {
            return (
            <TableRow key={image._id}>
              {columns.map(col => (
                <TableCell key={col.label + image._id}>
                  {col.get(image)}
                </TableCell>
              ))}
            </TableRow>
            )}
          )}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(ImagesTable);
