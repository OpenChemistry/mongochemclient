import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

const style = theme => (
  {
    body: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent'
    },
    content: {
      position: 'relative',
      width: '100%',
      height: '100%',
      maxWidth: theme.spacing.unit * theme.pageContent.width,
      left: '50%',
      transform: 'translateX(-50%)',
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    },
    overlap: {
      marginTop: theme.spacing.unit * theme.pageBody.marginTop
    }
  }
)

class PageBody extends Component {
  
  render() {
    const { classes, noOverlap } = this.props;
    let bodyClasses;
    if (noOverlap) {
      bodyClasses = classes.body;
    } else {
      bodyClasses = `${classes.body} ${classes.overlap}`
    }
    return (
      <div className={bodyClasses}>
        <div className={classes.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(style)(PageBody);

