import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  TextField
} from 'redux-form-material-ui'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Clear from 'material-ui/svg-icons/content/clear';
import Input from 'material-ui/svg-icons/action/input';
import { showNerscLogin } from '../redux/ducks/app';
import { authenticateNersc } from '../redux/ducks/nersc';
import selectors from '../redux/selectors';
import _ from 'lodash'
import { red500 } from 'material-ui/styles/colors'

const style = {
    content: {
        maxWidth: '500px'
    },
    button: {
      'margin-left': '10px',
    },
    actionsContainer: {
      float: 'right',
      'padding-top': '20px'
    },
    error: {
      fontSize: 12,
      lineHeight: '12px',
      color: red500
    }
}

const login = (values, dispatch) => {

  const {
    username,
    password} = values;

  return new Promise((resolve, reject) => {
    dispatch(authenticateNersc(username, password, reject, resolve));
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
    this.props.dispatch(showNerscLogin(false))
  };

  render = () => {
    const {error, handleSubmit, pristine, submitting, invalid} = this.props;

    return (
      <Dialog
        contentStyle={style.content}
        title="Sign in using NERSC NIM credentials"
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        <form onSubmit={handleSubmit(login)} >
          <Field
            name="username"
            component={TextField}
            hintText="NERSC Username"
            floatingLabelText="NERSC Username"
          />
          <Field
            name="password"
            component={TextField}
            hintText="NIM Password"
            floatingLabelText="NIM Password"
            type="password"
          />
          {error && <div style={style.error}>{_.has(error, 'message') ? error.message : error}</div>}
          <div style={style.actionsContainer}>
            <RaisedButton
              disabled={pristine || submitting || invalid}
              style={style.button}
              label="Login"
              labelPosition="after"
              primary={true}
              type='submit'
              icon={<Input />}
            />
            <RaisedButton
              disabled={submitting}
              style={style.button}
              label="Cancel"
              labelPosition="after"
              primary={true}
              icon={<Clear />}
              onClick={() => this.handleClose()}
            />
          </div>
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
  form: 'login',
  validate
})(NerscLogin)
