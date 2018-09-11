import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

const style = theme => (
  {
    header: {
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      paddingTop: theme.spacing.unit * theme.pageHead.paddingTop
    },
    content: {
      position: 'relative',
      width: '100%',
      maxWidth: theme.spacing.unit * theme.pageContent.width,
      left: '50%',
      transform: 'translateX(-50%)',
      color: theme.palette.primary.contrastText,
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    },
    overlap: {
      paddingBottom: theme.spacing.unit * theme.pageHead.paddingBottom,
    }
  }
)

class PageHead extends Component {
  
  render() {
    const { classes, noOverlap } = this.props;
    let headerClasses;
    if (noOverlap) {
      headerClasses = classes.header;
    } else {
      headerClasses = `${classes.header} ${classes.overlap}`
    }
    return (
      <div className={headerClasses}>
        <div className={classes.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(style)(PageHead);


