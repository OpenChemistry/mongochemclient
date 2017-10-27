import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  TextField
} from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Clear from 'material-ui/svg-icons/content/clear';
import Input from 'material-ui/svg-icons/action/input';
import { showNerscLogin } from '../redux/ducks/app';
import selectors from '../redux/selectors';

const style = {
    content: {
        maxWidth: '500px'
    },
    button: {
      'margin-left': '10px',
    },
    actionsContainer: {
      'padding-right': '20px',
      'padding-bottom': '20px'
    }
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
    const actions = [
      <RaisedButton
        style={style.button}
        label="Login"
        labelPosition="after"
        primary={true}
        icon={<Input />}
      />,
      <RaisedButton
        style={style.button}
        label="Cancel"
        labelPosition="after"
        primary={true}
        icon={<Clear />}
        onClick={() => this.handleClose()}
      />
    ];

    return (
      <Dialog
        contentStyle={style.content}
        actionsContainerStyle={style.actionsContainer}
        title="Sign in using NERSC NIM credentials"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        <form onKeyDown={this.onKeyDown}>
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
  form: 'login'
})(NerscLogin)
