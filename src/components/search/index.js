import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { InputBase, withStyles, Select, MenuItem, InputAdornment, IconButton, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { defaultTo } from 'lodash-es';

const SearchTooltip = withStyles(theme => ({
  popper: {
    opacity: 1.0,
  },
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 1.0)',
    maxWidth: 800,
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const styles = theme => ({
  root: {
  },
  fieldContainer: {
    display: 'flex',
    width: '100%'
  },
  fieldSelect: {
    backgroundColor: theme.palette.grey[200],
    borderBottomLeftRadius: theme.spacing.unit,
    borderTopLeftRadius: theme.spacing.unit,
    padding: theme.spacing.unit,
    paddingLeft: 2 * theme.spacing.unit,
    '&:before': {
      display: 'none'
    },
    '&:after': {
      display: 'none'
    },
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.grey[400],
    borderRightWidth: 1
  },
  fieldText: {
    flexGrow: 1,
    marginLeft: 2 * theme.spacing.unit,
  }
});

const SearchForm = ({fields, onSubmit, tooltips, classes}) => {
  const [currentField, setCurrentField] = useState(0);
  const [fieldValue, setFieldValue] = useState(fields[0].initialValue);

  const onCurrentFieldChange = (index) => {
    setCurrentField(index);
    onFieldValueChange(index, fields[index].initialValue);
  }

  const onFieldValueChange = (index, value) => {
    setFieldValue(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldName = fields[currentField].name;

    const values = fields.reduce((total, {name}) => {
      total[name] = undefined;
      return total;
    }, {});

    if (fieldValue.trim().length > 0) {
      values[fieldName] = fieldValue;
    }

    onSubmit(values);
  }

  const fieldOptions = fields.map(({label}, i) => (
    <MenuItem key={i} value={i}>{label}</MenuItem>
  ));

  const curFieldName = fields[currentField].name;
  const tooltip = defaultTo(tooltips[curFieldName], '');

  return (
    <Paper className={classes.root}>
    <form onSubmit={handleSubmit}>
      <SearchTooltip title={tooltip}>
        <div className={classes.fieldContainer}>
          <Select
            value={currentField} onChange={e => {onCurrentFieldChange(e.target.value)}}
            className={classes.fieldSelect}
          >
            {fieldOptions}
          </Select>
          <InputBase
            placeholder='Search'
            value={fieldValue} onChange={e => {onFieldValueChange(currentField, e.target.value)}}
            className={classes.fieldText}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton type='submit'>
                  <SearchIcon/>
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
      </SearchTooltip>
    </form>
    </Paper>
  );
};

export default withStyles(styles)(SearchForm);
