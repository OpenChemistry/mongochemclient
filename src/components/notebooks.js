import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

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
import _ from 'lodash';

import { jupyterlab } from '@openchemistry/redux';

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

  // We fake up the appropriate local storage to get jlab to load our notebook :-)
  setJupyterLocalStorage = (name) => {
    const layoutKey = 'jupyterlab:layout-restorer:data';
    const layoutValue = {
      v: {
        main: {
          dock: {
            type: 'tab-area',
            currentIndex: 0,
            widgets: [`notebook:${name}`]
          },
          mode: 'multiple-document',
          current:`notebook:${name}`
        },
        left: {
          collapsed: false,
          current: 'filebrowser',
          widgets: ['filebrowser','running-sessions','command-palette','tab-manager']
        },
        right:{
          collapsed:true,
          widgets:[]
        }
      }
    }
    localStorage.setItem(layoutKey, JSON.stringify(layoutValue))

    const notebookKey = `jupyterlab:notebook:${name}`;
    const notebookValue = {
      v: {
        data: {
          path: name,
          factory:'Notebook'
        }
      }
    }
    localStorage.setItem(notebookKey, JSON.stringify(notebookValue))
  }

  onCellClick = (row) =>  {
    if (this.state.loading) {
      return;
    }
    const name = this.props.notebooks[row].name
    this.setJupyterLocalStorage(name);
    this.props.dispatch(jupyterlab.redirectToJupyterHub());
    this.setState({loading: true});
  }

  render = () => {
    const {notebooks} = this.props;
    if (!_.isNil(this.props.onCellClick)) {
      this.onCellClick = this.props.onCellClick;
    }

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
