import React from 'react';
import { withStyles, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Pagination from 'material-ui-flat-pagination';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
});

const PaginationSortComponent = ({sortIndex, sortOptions, offset, matches, limit, onChange, classes}) => {

  const handleSortChange = (event) => {
    const value = event.target.value;
    onChange('sortIndex', value);
  }

  return (
    <div className={classes.root}>
      <Pagination offset={offset} total={matches} limit={limit}
        currentPageColor='secondary' otherPageColor='inherit'
        onClick={(e, offset) => { onChange('offset', offset); }}
      />
      <FormControl className={classes.formControl}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortIndex}
          onChange={handleSortChange}
        >
        {
          sortOptions.map((option, index) => {
            return (
              <MenuItem value={index} key={index}>{option.label}</MenuItem>
            )
          })
        }
        </Select>
      </FormControl>
    </div>
  );
}

export default withStyles(styles)(PaginationSortComponent);
