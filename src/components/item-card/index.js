import React, { Fragment } from 'react';
import {
  Card, CardActionArea, CardHeader, CardContent,
  Typography,
  withStyles
} from '@material-ui/core';

const style = (theme) => (
  {
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.unit
    },
    cardImage: {
      width: '100%',
      height: 20 * theme.spacing.unit,
      backgroundColor: theme.palette.grey[200]
    },
    cardActionArea: {
      width: '100%'
    }
  }
);

const Image = (src) => {
  return (
    <img style={{objectFit: 'contain', width: '100%', height: '100%'}} src={src} alt='program-logo'/>
  );
}

const CardComponent = ({title, image, properties, onOpen, classes}) => {
  return (
    <Card>
      <CardActionArea onClick={onOpen}>
        <CardHeader title={title}></CardHeader>
        <div className={classes.cardImage}>
          {Image(image)}
        </div>
        <CardContent>
          {properties.map(({label, value}, i) => (
            <div className={classes.row} key={i}>
              <Typography component='div' color='textSecondary'>{label}</Typography>
              <Typography component='div'>{value}</Typography>
            </div>
          ))}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default withStyles(style)(CardComponent);
