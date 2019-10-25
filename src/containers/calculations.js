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
  {name: 'inchi', type: 'text', label: 'Inchi', initialValue: ''},
  {name: 'inchikey', type: 'text', label: 'Inchi Key', initialValue: ''},
  {name: 'smiles', type: 'text', label: 'Smiles', initialValue: ''}
];

class CalculationsContainer extends Component {

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    this.state = {
      sortIndex: params.get('sortIndex') || 0,
      paginationOptions: {
        limit: params.get('limit') || 16,
        offset: params.get('offset') || 0,
        sort: params.get('sort') ? params.get('sort').toString() : '_id',
        sortdir: params.get('sortdir') || -1
      },
      searchOptions: {
        formula: params.get('formula') || '',
        name: params.get('name') || '',
        inchi: params.get('inchi') || '',
        inchikey: params.get('inchikey') || '',
        smiles: params.get('smiles') || ''
      }
    }
  }

  componentDidMount() {
    const { paginationOptions, searchOptions } = this.state;
    var creatorId = null;
    if (this.props.match.params.id) {
      creatorId = this.props.match.params.id;
    }
    const options = {...paginationOptions, ...searchOptions}
    this.props.dispatch(calculations.loadCalculations({options, loadMolecules: true, creatorId: creatorId}));
  }

  componentDidUpdate(prevProps) {
    const currSearch = this.props.location.search;
    const prevSearch = prevProps.location.search;
    const params = new URLSearchParams(currSearch);
    const reload = (
      this.props.history.action === 'POP' || params.get('offset') == 0);
    if (currSearch !== prevSearch && reload) {
      var offset = params.get('offset')
      this.setState({
        sortIndex: params.get('sortIndex') || 0,
        paginationOptions: {
          limit: params.get('limit') || 16,
          offset: params.get('offset') || 0,
          sort: params.get('sort') ? params.get('sort').toString() : '_id',
          sortdir: params.get('sortdir') || -1
        },
        searchOptions: {
          formula: params.get('formula') || '',
          name: params.get('name') || '',
          inchi: params.get('inchi') || '',
          inchikey: params.get('inchikey') || '',
          smiles: params.get('smiles') || ''
        }
      }, () => {
        const options = {...this.state.paginationOptions, ...this.state.searchOptions};
        var creatorId = null;
        if (this.props.match.params.id) {
          creatorId = this.props.match.params.id;
        }
        this.props.dispatch(calculations.loadCalculations({options, loadMolecules: true, creatorId}));
      });
    }
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

    const {sortIndex} = this.state;
    const {sortdir, sort, limit, offset} = pagination;
    for (let val in search) {
      if (search[val] === undefined) {
        search[val] = '';
      }
    }
    const params = {sortIndex, sortdir, sort, limit, offset, ...search};
    const query = new URLSearchParams(params).toString();

    this.props.dispatch(calculations.loadCalculations({options, loadMolecules: true, creatorId}));
    this.props.dispatch(push({pathname:'/calculations', search:query}));
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
