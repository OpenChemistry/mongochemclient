import React from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, TextField, FormControl, withStyles } from '@material-ui/core';

const styles = theme => ({
  field: {
    marginBottom: theme.spacing.unit
  }
});

const SearchForm = ({fields, onSubmit, classes}) => {
  const initialValues = fields.reduce((total, {name, initialValue}) => {
    total[name] = initialValue;
    return total;
  }, {});

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        onSubmit(values);
      }}
    >
      {({isSubmitting}) => (
        <Form>
          {fields.map(({type, name, label}) => {
          return (
            <Field key={name} name={name}
              render={({field}) => (
                <FormControl fullWidth className={classes.field}>
                  <TextField {...field} label={label}/>
                </FormControl>
              )}
            />
          )})}
          <Button type='submit' disabled={isSubmitting} variant='contained' color='primary'>Search</Button>
        </Form>
        )
      }
    </Formik>
  );
};

export default withStyles(styles)(SearchForm);
