import React, { Component } from 'react';
import { connect } from 'react-redux'
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
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import {blue500} from 'material-ui/styles/colors';
import filesize from 'filesize'
import moment from 'moment'
import _ from 'lodash';


import { redirectToJupyterHub } from '../redux/ducks/jupyterlab'

const style = {
  iconColumn:  {
    width: '20px'
  }
}

class Notebooks extends Component {

  // We fake up the appropriate local storage to get jlab to load our notebook :-)
  setJupyterLocalStorage = (name) => {
    const layoutKey = 'jupyterlab:layout-restorer:data';
    const layoutValue = {
      main: {
        dock: {
          type: 'tab-area',
          currentIndex: 3,
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
    localStorage.setItem(layoutKey, JSON.stringify(layoutValue))

    const notebookKey = `jupyterlab:notebook:${name}`;
    const notebookValue = {
      data: {
        path: name,
        factory:'Notebook'
      }
    }
    localStorage.setItem(notebookKey, JSON.stringify(notebookValue))
  }

  onCellClick = (row) =>  {

    const name = this.props.notebooks[row].name
    this.setJupyterLocalStorage(name);
    this.props.dispatch(redirectToJupyterHub());
  }

  render = () => {
    const {notebooks} = this.props;
    if (!_.isNil(this.props.onCellClick)) {
      this.onCellClick = this.props.onCellClick;
    }

    return (
        <div>
        <Table
          onCellClick={this.onCellClick}
        >
          <TableHeader
            fixedHeader={true}
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn style={style.iconColumn}></TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
              <TableHeaderColumn>Last Modified</TableHeaderColumn>
              <TableHeaderColumn>Size</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            showRowHover={true}
          >
          {notebooks.map((notebook, i) =>
            <TableRow
              key={notebook._id}>
            >
              <TableRowColumn style={style.iconColumn}>
                <Avatar icon={<InsertDriveFile />} backgroundColor={blue500} />
              </TableRowColumn>
              <TableRowColumn>{notebook.name}</TableRowColumn>
              <TableRowColumn>{moment(notebook.created).fromNow()}</TableRowColumn>
              <TableRowColumn>{filesize(notebook.size)}</TableRowColumn>
            </TableRow>
          )}
          </TableBody>
        </Table>
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
