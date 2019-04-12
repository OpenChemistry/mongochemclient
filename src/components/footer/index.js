import React from 'react';

import { Typography, withStyles } from '@material-ui/core';

const style = theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    textAlign: 'center',
    padding: 2 * theme.spacing.unit
  },
  license: {

  },
  logo: {
    flexGrow: 1
  },
  logoImg: {
    height: 8 * theme.spacing.unit
  },
  privacy: {
  }
});

const Footer = (props) => {
  const {privacy, license, footerLogoImageUrl, footerLogoUrl, classes} = props;
  return (
    <div className={classes.root}>
      <div className={classes.license}>
        {license &&
        <Typography variant='caption'>
            All data is released under <a href={license.url} target='_blank'>{license.label}</a>
        </Typography>
        }
      </div>
      <div className={classes.logo}>
        {footerLogoUrl &&
         <a href={footerLogoUrl} target="_blank"><img className={classes.logoImg} src={footerLogoImageUrl}/></a>
        }
      </div>
      <div className={classes.privacy}>
        {privacy &&
          <Typography variant='caption'>
            <a style={style.privacy} href={privacy.url} target='_blank'>{privacy.label}</a>
          </Typography>
        }
      </div>
    </div>
  );
}

export default withStyles(style)(Footer)
