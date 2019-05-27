import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { calculations, molecules } from '@openchemistry/redux'

import { isNil } from 'lodash-es';

import PaginationSort from '../components/pagination-sort';
import Calculations from '../components/calculations';

const sortOptions = [
  {
    label: 'Newest',
    sort: '_id',
    sortdir: -1
  },
  {
    label: 'Oldest',
    sort: '_id',
    sortdir: 1
  }
];

class CalculationsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortIndex: 0,
      paginationOptions: { limit: 4, offset: 0, sort: '_id', sortdir: -1 }
    }
  }

  componentDidMount() {
    const { paginationOptions } = this.state;
    this.props.dispatch(calculations.loadCalculations({options: paginationOptions, loadMolecules: true}));
  }

  onOpen = (id) => {
    this.props.dispatch(push(`/calculations/${id}?mo=homo`));
  }

  onChange = (key, value) => {
    switch(key) {
      case 'sortIndex': {
        this.setState(state => {state.sortIndex = value; return state;});
        const {sort, sortdir} = sortOptions[value];
        this.onOptionsChange({sort, sortdir});
        return;
      }
      case 'offset': {
        this.onOptionsChange({offset: value});
      }
      default: {
      }
    }
  }

  onOptionsChange = (options) => {
    const paginationOptions = {...this.state.paginationOptions, ...options};
    this.props.dispatch(calculations.loadCalculations({options: paginationOptions, loadMolecules: true}));
    this.setState(state => {
      state.paginationOptions = paginationOptions;
      return state;
    });
  }

  render() {
    const { calculations, molecules, matches } = this.props;
    if (isNil(calculations)) {
      return null;
    }
    const { paginationOptions, sortIndex } = this.state;
    const { limit, offset } = paginationOptions;
    return (
      <Calculations calculations={calculations} molecules={molecules} onOpen={this.onOpen}>
        <br/>
        <PaginationSort
          sortIndex={sortIndex} sortOptions={sortOptions} onChange={this.onChange}
          offset={offset}
          limit={limit}
          matches={matches}
        />
      </Calculations>
    );
  }
}

CalculationsContainer.propTypes = {
}

CalculationsContainer.defaultProps = {
}

function mapStateToProps(state, ownProps) {
  let calculations = selectors.calculations.getCalculations(state);
  let molecules = selectors.molecules.getMoleculesById(state);
  let matches = selectors.calculations.getMatches(state);
  return { calculations, molecules, matches };
}

export default connect(mapStateToProps)(CalculationsContainer)
