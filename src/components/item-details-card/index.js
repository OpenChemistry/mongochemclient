import React, { Component, Fragment } from 'react';
import {
  Card, CardActionArea, CardHeader, CardContent,
  IconButton,
  Collapse,
  Typography,
  withStyles
} from '@material-ui/core';

import KeyBoardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

const style = (theme) => (
  {
    card: {
      marginBottom: 2 * theme.spacing.unit
    },
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

class CardComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  render() {
    const {title, image, properties, classes} = this.props;
    const {collapsed} = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          title={title}
          titleTypographyProps={{variant: 'h6'}}
          action={
            <IconButton
              onClick={() => {this.setState({collapsed: !collapsed})}}
            >
              {collapsed ? <KeyBoardArrowDown/> : <KeyboardArrowUp/>}
            </IconButton>
          }
        />
        <Collapse in={!collapsed}>
          <CardContent>
            {properties.map(({label, value}, j) => (
              <div className={classes.row} key={j}>
                <Typography component='div' color='textSecondary'>{label}</Typography>
                <Typography component='div'>{value}</Typography>
              </div>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

// const CardComponent = ({title, image, sections, classes}) => {
//   return (
//     <Card>
//       <CardContent>
//         {sections.map(({label, properties}, i) => {
//           return (
//             <Fragment key={i}>
//               <Typography variant={'h6'} gutterBottom>{label}</Typography>
//               <IconButton
//                 onClick={() => {}}
//               >
//                 {false ? <KeyboardArrowUp/> : <KeyBoardArrowDown/>}
//               </IconButton>
//               {properties.map(({label, value}, j) => (
//                 <div className={classes.row} key={j}>
//                   <Typography component='div' color='textSecondary'>{label}</Typography>
//                   <Typography component='div'>{value}</Typography>
//                 </div>
//               ))}
//             </Fragment>
//           )
//         })}
//       </CardContent>
//     </Card>
//   );
// }

export default withStyles(style)(CardComponent);
