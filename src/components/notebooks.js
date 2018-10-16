import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import InsertDriveFile from '@material-ui/icons/InsertDriveFile';

import blue from '@material-ui/core/colors/blue';

import filesize from 'filesize'
import moment from 'moment'
import _ from 'lodash';

import { jupyterlab } from '@openchemistry/redux';

import PageHead from './page-head';
import PageBody from './page-body';
import { Paper } from '@material-ui/core';

const blue500 = blue['500'];

const style = {
  iconColumn:  {
    width: 20
  }
}

class Notebooks extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  onCellClick = (row) =>  {
    if (this.state.loading) {
      return;
    }
    const name = this.props.notebooks[row].name
    this.props.dispatch(jupyterlab.redirectToJupyterHub(name));
    this.setState({loading: true});
  }

  render = () => {
    const {notebooks} = this.props;
    if (!_.isNil(this.props.onCellClick)) {
      this.onCellClick = this.props.onCellClick;
    }

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Notebooks
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            Click on any notebook to be redirected to JupyterHub
          </Typography>
        </PageHead>
        <PageBody>
          <Paper>
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
                  style={{cursor: this.state.loading ? "progress" : "pointer"}}
                  hover
                  onClick={event => this.onCellClick(i)}
                  key={notebook._id}
                >
                  <TableCell style={style.iconColumn}>
                    <Avatar style={{backgroundColor: blue500}}>
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
          </Paper>
        </PageBody>
      </div>
    );
  }
}

Notebooks.propTypes = {
  notebooks: PropTypes.array
}

Notebooks.defaultProps = {
  notebooks: [],
}

export default connect()(Notebooks)
