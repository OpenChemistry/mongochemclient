import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { molecules } from '@openchemistry/redux'

import { has, isNil, isUndefined } from 'lodash-es';

import PaginationSort from '../components/pagination-sort';
import Molecules from '../components/molecules';
import SearchForm from '../components/search';
import { advancedSearchToMolQuery } from '../utils/search';

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
  },
  {
    label: 'Formula (Descending)',
    sort: 'properties.formula',
    sortdir: -1
  },
  {
    label: 'Formula (Ascending)',
    sort: 'properties.formula',
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
  {name: 'smiles', type: 'text', label: 'SMILES', initialValue: ''},
  {name: 'advanced', type: 'text', label: 'Advanced', initialValue: ''}
]

const advancedFields = [
  'mass',
  'atomCount',
  'heavyAtomCount',
  'inchi',
  'inchikey',
  'name',
  'formula',
  'smiles'
]

const advancedComparisonOperators = [
  '==',
  '!=',
  '>=',
  '<=',
  '>',
  '<'
]

const advancedLogicalOperators = [
  'and',
  'or'
]

const advancedTooltip = (
  <React.Fragment>
    <b>{'Fields: '}</b> {advancedFields.join(', ')} <br/>
    <b>{'Comparison Operators: '}</b>
    {advancedComparisonOperators.join(', ')} <br/>
    <b>{'Logical Operators: '}</b> {advancedLogicalOperators.join(', ')} <br/>
    <b>{'Example: '}</b> {'mass >= 200 and atomCount < 40'}
  </React.Fragment>
);

const tooltips = {
  'formula': '',
  'name': '',
  'inchi': '',
  'inchikey': '',
  'smiles': '',
  'advanced': advancedTooltip
}

class MoleculesContainer extends Component {

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
    Object.keys(options).forEach(
      (key) => (options[key] == '') && delete options[key]);
    this.props.dispatch(molecules.loadMolecules({options, creatorId}));
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
        Object.keys(options).forEach(
          (key) => (options[key] == '') && delete options[key]);
        var creatorId = null;
        if (this.props.match.params.id) {
          creatorId = this.props.match.params.id;
        }
        this.props.dispatch(molecules.loadMolecules({options, creatorId}));
      });
    }
  }

  onOpen = (inchikey) => {
    this.props.dispatch(push(`/molecules/inchikey/${inchikey}`));
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
    if (has(search, 'advanced') && search.advanced !== undefined) {
      // advanced gets special treatment
      search.queryString = advancedSearchToMolQuery(search.advanced);
      delete search.advanced
    }
    const options = {...pagination, ...search};
    var creatorId = null;
    if (this.props.match.params.id) {
      creatorId = this.props.match.params.id;
    }

    const {sortIndex} = this.state;
    const {sortdir, sort, limit, offset} = pagination;
    for (let val in search) {
      if (isUndefined(search[val])) {
        search[val] = '';
      }
    }
    const params = {sortIndex, sortdir, sort, limit, offset, ...search};
    const query = new URLSearchParams(params).toString();

    Object.keys(options).forEach(
      (key) => (options[key] == '') && delete options[key]);
    this.props.dispatch(molecules.loadMolecules({options, creatorId}));
    this.props.dispatch(push({pathname:'/molecules', search:query}));
  }

  render() {
    const { molecules, matches } = this.props;
    if (isNil(molecules)) {
      return null;
    }
    const { paginationOptions, sortIndex } = this.state;
    const { limit, offset } = paginationOptions;
    return (
      <Molecules molecules={molecules} matches={matches} onOpen={this.onOpen} onOptionsChange={this.onOptionsChange}
        before={
          <SearchForm
            fields={searchFields}
            onSubmit={this.onSearchChange}
            tooltips={tooltips}
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
      >
      </Molecules>
    );
  }
}

MoleculesContainer.propTypes = {
}

MoleculesContainer.defaultProps = {
}

function mapStateToProps(state, ownProps) {
  let molecules = selectors.molecules.getMolecules(state);
  const matches = selectors.molecules.getMatches(state);
  return { molecules, matches };
}

export default connect(mapStateToProps)(MoleculesContainer)
