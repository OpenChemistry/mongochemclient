import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TextField
} from 'redux-form-material-ui';
import { Field, reduxForm, SubmissionError } from 'redux-form'

import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputIcon from '@material-ui/icons/Input';
import red from '@material-ui/core/colors/red'

import { selectors } from '@openchemistry/redux';
import { nersc } from '@openchemistry/redux';
import { app } from '@openchemistry/redux';

import _ from 'lodash'

const red500 = red['500'];

const style = {
  error: {
    color: red500
  }
}

const login = (values, dispatch) => {

  const {
    username,
    password} = values;

  return new Promise((resolve, reject) => {
    dispatch(nersc.authenticateNersc(username, password, reject, resolve));
  }).catch(_error => {
    throw new SubmissionError({ _error });
  });
}

const validate = values => {
  const errors = {}
  const requiredFields = [ 'username', 'password']
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })

  return errors
}


class NerscLogin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const {open} = nextProps;
    this.setState({
      open
    });
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
    this.props.dispatch(app.showNerscLogin(false))
  };

  render = () => {
    const {error, handleSubmit, pristine, submitting, invalid} = this.props;

    return (
      <Dialog
        aria-labelledby="nersc-dialog-title"
        open={this.state.open}
        onClose={this.handleClose}
      >
        <DialogTitle id="nersc-dialog-title">Sign in using NERSC NIM credentials</DialogTitle>
        <form onSubmit={handleSubmit(login)} >
          <DialogContent>
            <div>
              <Field
                className="full-width"
                name="username"
                component={TextField}
                placeholder="NERSC Username"
                label="NERSC Username"
              />
            </div>
            <div>
              <Field
                className="full-width"
                name="password"
                component={TextField}
                placeholder="NIM Password"
                label="NIM Password"
                type="password"
              />
            </div>
            {error && <div style={style.error}>{_.has(error, 'message') ? error.message : error}</div>}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={pristine || submitting || invalid}
              variant="contained"
              color="secondary"
              className="action-btn"
              type='submit'
            >
              <InputIcon className="l-icon-btn" />
              Login
            </Button>
            <Button
              disabled={submitting}
              variant="contained"
              color="secondary"
              className="action-btn"
              onClick={() => this.handleClose()}
            >
              <ClearIcon className="l-icon-btn" />
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const open = selectors.app.showNerscLogin(state);

  return {
    open,
  }
}

NerscLogin = connect(mapStateToProps)(NerscLogin)


export default reduxForm({
  form: 'nerscLogin',
  validate
})(NerscLogin)
