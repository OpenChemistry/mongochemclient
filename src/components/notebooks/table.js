import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import InsertDriveFile from '@material-ui/icons/InsertDriveFile';

import blue from '@material-ui/core/colors/blue';

import filesize from 'filesize'
import moment from 'moment'

const style = {
  iconColumn:  {
    width: 20
  }
}

class NotebooksTable extends Component {

  render() {
    const {notebooks, onOpen, redirecting} = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={style.iconColumn}></TableCell>
            <TableCell>Filename</TableCell>
            <TableCell>Last Modified</TableCell>
            <TableCell>Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody
        >
        {notebooks.map((notebook, i) =>
          <TableRow
            style={{cursor: "pointer"}}
            hover
            onClick={() => {
              if (!redirecting) {
                onOpen(notebook);
              }
            }}
            key={notebook._id}
          >
            <TableCell style={style.iconColumn}>
              <Avatar style={{backgroundColor: blue[500]}}>
                <InsertDriveFile />
              </Avatar>
            </TableCell>
            <TableCell>{notebook.name}</TableCell>
            <TableCell>{moment(notebook.created).fromNow()}</TableCell>
            <TableCell>{filesize(notebook.size)}</TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
    );
  }
}

export default NotebooksTable;
