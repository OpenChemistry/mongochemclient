import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';

import ChromeReaderIcon from '@material-ui/icons/ChromeReaderMode'
import ContactsIcon from '@material-ui/icons/ImportContacts';
import GroupIcon from '@material-ui/icons/GroupWork';

import { TwitterTimelineEmbed } from 'react-twitter-embed';

import PageHead from '../page-head';
import PageBody from '../page-body';

import BlogFeed from './blog';

import { wc } from '../../utils/webcomponent';

import './index.css';

const style = theme => (
  {
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      paddingBottom: '0.75rem'
    },
    body: {
      flexGrow: 1,
      marginTop: 0
    },
    evenColumns: {
      backgroundColor: 'none',
      padding: '1.5rem'
    },
    oddColumns: {
      backgroundColor: grey[200],
      padding: '1.5rem'
    },
    molecule: {
      width: '100%',
      height: '20rem'
    },
    columnTitle: {
      marginBottom: '1.5rem'
    }
  }
)

let EmbeddedVideo = () => {
  return (
    <div className="intrinsic-container intrinsic-container-16x9">
      <iframe title="reproducible-quantum-chemistry" src="https://www.youtube.com/embed/31THsQEyjYQ" frameBorder="0" allowFullScreen></iframe>
    </div>
  );
}

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      molecule: null,
      rotate: true,
      posts: null
    }
  }

  // Fake fetch of a molecule of the week
  componentDidMount() {
    fetch('/api/v1/molecules/')
    .then((res) => {
      return res.json();
    })
    .then((molecules) => {
      if (molecules.length > 0) {
        const molecule = molecules[molecules.length - 1];
        const id = molecule.id;
        return fetch(`/api/v1/molecules/${id}`)
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((cjson) => {
      this.setState({...this.state, molecule: cjson.cjson});
    });

    fetch('https://blog.kitware.com/wp-json/wp/v2/posts?tags=12&per_page=4')
    .then((res) => {
      return res.json();
    })
    .then((posts) => {
      this.setState({...this.state, posts: posts});
    });
  }

  onMoleculeInteract() {
    if (this.state.rotate) {
      this.setState({...this.state, rotate: false});
    }
  }
  
  render = () => {
    const { classes } = this.props;
    const { molecule, rotate, posts } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <PageHead noOverlap>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography color="inherit" gutterBottom variant="display1">
                  Open Chemistry
                </Typography>
                <Typography variant="title" paragraph color="inherit">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
                <Typography color="inherit" gutterBottom variant="body2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec augue ac ante semper facilisis vitae sed tellus. Aliquam non suscipit sapien, vel bibendum augue. Vivamus pharetra maximus ante. Sed finibus turpis et nibh sollicitudin malesuada. In hac habitasse platea dictumst.
                </Typography>
                <Typography color="inherit" gutterBottom variant="body2">
                  Aenean vitae tortor at purus convallis sagittis. Aliquam erat volutpat. Praesent ut tortor lacus. Cras ac augue et mi blandit blandit ac vel orci. Praesent semper condimentum ultrices. Ut a tellus eleifend, finibus nunc consectetur, malesuada enim.
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <div>
                  <EmbeddedVideo/>
                </div>
              </Grid>
            </Grid>
          </PageHead>
        </div>
        <div className={classes.body}>
          <PageBody noOverlap>
          <Grid container style={{height: '100%'}} alignItems="stretch">
            <Grid item xs={12} md={4} className={classes.evenColumns}>
              <div className={classes.columnTitle}>
                <Typography gutterBottom variant="title" color="textSecondary">
                  <ContactsIcon />&nbsp;Blog
                </Typography>
              </div>
              <BlogFeed posts={posts} />
              <Button href="https://blog.kitware.com/tag/open-chemistry/" target="_blank">More posts</Button>
            </Grid>
            <Grid item xs={12} md={4} className={classes.oddColumns}>
              <div className={classes.columnTitle}>
                <Typography gutterBottom variant="title" color="textSecondary">
                  <ChromeReaderIcon />&nbsp;Feed
                </Typography>
              </div>
              <Paper>
                <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName="openchem"
                  options={{height: 800}}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} className={classes.evenColumns}>
              <div className={classes.columnTitle}>
                <Typography variant="title" color="textSecondary">
                  <GroupIcon />&nbsp;Structures
                </Typography>
              </div>
                <Paper className={classes.molecule}
                  onMouseEnter={(e) => {this.onMoleculeInteract()}}
                >
                  <oc-molecule
                    ref={wc(
                      {},
                      {
                        cjson: molecule,
                        rotate: rotate
                      }
                    )}
                  />
                </Paper>
            </Grid>
          </Grid>
          </PageBody>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(Home);
