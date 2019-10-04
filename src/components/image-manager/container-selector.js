import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const styles = theme => {
  const ret = {
    root: {
      display: 'flex'
    },
    formControl: {
      minWidth: 200,
      margin: theme.spacing.unit
    },
    select: {
      minWidth: 200
    }
  };
  return ret;
};

class ContainerSelector extends Component {
  constructor(props) {
    super(props);

    const { onChange, fields } = props;
    this.onChange = onChange;

    this.fieldOptions = fields.map(({ label }, i) => (
      <MenuItem key={i} value={i}>
        {label}
      </MenuItem>
    ));

    this.state = {
      value: 0
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
    this.onChange(event);
  };

  render() {
    const { classes } = this.props;

    return (
      <FormControl className={classes.formControl}>
        <InputLabel>Container Type</InputLabel>
        <Select
          value={this.state.value}
          onChange={this.handleChange}
          className={classes.select}
        >
          {this.fieldOptions}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(ContainerSelector);
