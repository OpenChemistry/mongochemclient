import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { calculations, molecules } from '@openchemistry/redux'

import { isNil } from 'lodash-es';

import PaginationSort from '../components/pagination-sort';
import Calculations from '../components/calculations';
import SearchForm from '../components/search';

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

const limitOptions = [
  4,
  8,
  16,
  32,
  64
];

const searchFields = [
  {name: 'formula', type: 'text', label: 'Formula', initialValue: ''},
  {name: 'name', type: 'text', label: 'Name', initialValue: ''},
  {name: 'inchi', type: 'text', label: 'InChi', initialValue: ''},
  {name: 'inchikey', type: 'text', label: 'InChi Key', initialValue: ''},
  {name: 'smiles', type: 'text', label: 'SMILES', initialValue: ''}
];

class CalculationsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortIndex: 0,
      paginationOptions: { limit: 16, offset: 0, sort: '_id', sortdir: -1 },
      searchOptions: {}
    }
  }

  componentDidMount() {
    const { paginationOptions } = this.state;
    var creatorId = null;
    if (this.props.match.params.id) {
      creatorId = this.props.match.params.id;
    }
    this.props.dispatch(calculations.loadCalculations({options: paginationOptions, loadMolecules: true, creatorId: creatorId}));
  }

  onOpen = (id) => {
    this.props.dispatch(push(`/calculations/${id}?mo=homo`));
  }

  onPaginationChange = (key, value) => {
    const {searchOptions, paginationOptions} = this.state;

    let changes;
    switch(key) {
      case 'sortIndex': {
        this.setState(state => {state.sortIndex = value; return state;});
        const {sort, sortdir} = sortOptions[value];
        changes = {sort, sortdir};
        break;
      }
      case 'limit': {
        changes = {limit: value, offset: 0};
        break;
      }
      case 'offset': {
        changes = {offset: value};
        break;
      }
      default: {
        changes = {};
      }
    }

    const newPaginationOptions = {...paginationOptions, ...changes};
    this.setState(state => {
      state.paginationOptions = newPaginationOptions;
      return state;
    });
    this.onOptionsChange(newPaginationOptions, searchOptions);
  }

  onSearchChange = (values) => {
    const newPaginationOptions = {...this.state.paginationOptions, offset: 0};
    this.setState(state => {
      state.paginationOptions = newPaginationOptions;
      state.searchOptions = values;
      return state;
    });

    this.onOptionsChange(newPaginationOptions, values);
  }

  onOptionsChange = (pagination, search) => {
    const options = {...pagination, ...search};
    var creatorId = null;
    if (this.props.match.params.id) {
      creatorId = this.props.match.params.id;
    }
    this.props.dispatch(calculations.loadCalculations({options, loadMolecules: true, creatorId}));
  }

  render() {
    const { calculations, molecules, matches } = this.props;
    if (isNil(calculations)) {
      return null;
    }
    const { paginationOptions, sortIndex } = this.state;
    const { limit, offset } = paginationOptions;
    return (
      <Calculations calculations={calculations} molecules={molecules} onOpen={this.onOpen}
        before={
          <SearchForm
            fields={searchFields}
            onSubmit={this.onSearchChange}
            tooltips={{}}
          />
        }
        after={
          <PaginationSort
            sortIndex={sortIndex} sortOptions={sortOptions} onChange={this.onPaginationChange}
            offset={offset}
            limit={limit}
            limitOptions={limitOptions}
            matches={matches}
          />
        }
      />
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
