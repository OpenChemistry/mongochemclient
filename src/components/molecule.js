import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import _ from 'lodash';

import PageHead from './page-head';
import PageBody from './page-body';
import { Paper, Card } from '@material-ui/core';

import { wc } from '../utils/webcomponent';

class Molecule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rotate: false
    }
  }

  onInteract = () => {
    if (this.state.rotate) {
      this.setState({...this.state, rotate: false});
    }
  }

  render = () => {
    const {molecule} = this.props;

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Molecule
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            InChIKey: {molecule.inchikey}
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            ID: {molecule._id}
          </Typography>

        </PageHead>
        <PageBody>
          <Card>
            <div style={{height: '40rem', width: '100%'}} onMouseEnter={this.onInteract}>
              <oc-molecule
                ref={wc(
                  // Events
                  {},
                  //Props
                  {
                    cjson: molecule.cjson,
                    rotate: this.state.rotate                    
                  }
                )}
              />
            </div>
          </Card>
        </PageBody>
      </div>
    );
  }
}

Molecule.propTypes = {
  molecule: PropTypes.object
}

Molecule.defaultProps = {
  molecule: null
}

export default Molecule;
