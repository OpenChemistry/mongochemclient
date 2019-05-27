import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { molecules } from '@openchemistry/redux'

import { isNil } from 'lodash-es';

import PaginationSort from '../components/pagination-sort';
import Molecules from '../components/molecules';
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
  {name: 'inchi', type: 'text', label: 'Inchi', initialValue: ''},
  {name: 'inchikey', type: 'text', label: 'Inchi Key', initialValue: ''},
  {name: 'smiles', type: 'text', label: 'Smiles', initialValue: ''}
]

class MoleculesContainer extends Component {

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
    this.props.dispatch(molecules.loadMolecules(paginationOptions));
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
    const options = {...pagination, ...search};
    this.props.dispatch(molecules.loadMolecules(options));
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
