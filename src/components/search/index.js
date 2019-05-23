import React, { useState } from 'react';

import { TextField, FormControl, withStyles, Select, MenuItem } from '@material-ui/core';

const styles = theme => ({
  fieldContainer: {
    display: 'flex'
  },
  fieldSelect: {

  },
  fieldText: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit
  }
});

const SearchForm = ({fields, onSubmit, classes}) => {
  const [currentField, setCurrentField] = useState(0);
  const [fieldValue, setFieldValue] = useState(fields[0].initialValue);

  const onCurrentFieldChange = (index) => {
    setCurrentField(index);
    onFieldValueChange(index, fields[index].initialValue);
  }

  const onFieldValueChange = (index, value) => {
    setFieldValue(value);
    onSubmit({[fields[index].name]: value});
  }

  const fieldOptions = fields.map(({label}, i) => (
    <MenuItem key={i} value={i}>{label}</MenuItem>
  ));

  return (
    <FormControl fullWidth>
      <div className={classes.fieldContainer}>
      <Select value={currentField} onChange={e => {onCurrentFieldChange(e.target.value)}}>
        {fieldOptions}
      </Select>
      <TextField value={fieldValue} onChange={e => {onFieldValueChange(currentField, e.target.value)}} className={classes.fieldText}/>
      </div>
    </FormControl>
  );
};

export default withStyles(styles)(SearchForm);
