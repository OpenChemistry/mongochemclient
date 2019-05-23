import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

import { selectors } from '@openchemistry/redux'
import { molecules } from '@openchemistry/redux'

import { isNil } from 'lodash-es';

import PaginationSort from '../components/pagination-sort';
import Molecules from '../components/molecules';
import SearchForm from '../components/search';
import CollapsibleCard from '../components/collapsible-card';

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

const searchFields = [
  {name: 'name', type: 'text', label: 'Name', initialValue: ''},
  {name: 'formula', type: 'text', label: 'Formula', initialValue: ''},
  {name: 'inchi', type: 'text', label: 'Inchi', initialValue: ''},
  {name: 'inchikey', type: 'text', label: 'Inchi Key', initialValue: ''},
  {name: 'smiles', type: 'text', label: 'Smiles', initialValue: ''}
]

class MoleculesContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortIndex: 0,
      paginationOptions: { limit: 4, offset: 0, sort: '_id', sortdir: -1 }
    }
  }

  componentDidMount() {
    const { paginationOptions } = this.state;
    this.props.dispatch(molecules.loadMolecules(paginationOptions));
  }

  onOpen = (inchikey) => {
    this.props.dispatch(push(`/molecules/inchikey/${inchikey}`));
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
    this.props.dispatch(molecules.loadMolecules(paginationOptions));
    this.setState(state => {
      state.paginationOptions = paginationOptions;
      return state;
    });
  }

  onSearch = (values) => {
    values = Object.entries(values).reduce((filtered, [key, value]) => {
      if (value.trim().length > 0) {
        filtered[key] = value.trim();
      } else {
        filtered[key] = undefined;
      }
      return filtered;
    }, {});
    const options = {...values, offset: 0};
    this.onOptionsChange(options);
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
          <CollapsibleCard title='Filters'>
            <SearchForm
              fields={searchFields}
              onSubmit={this.onSearch}
            />
          </CollapsibleCard>
        }
        after={
          <PaginationSort
            sortIndex={sortIndex} sortOptions={sortOptions} onChange={this.onChange}
            offset={offset}
            limit={limit}
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
