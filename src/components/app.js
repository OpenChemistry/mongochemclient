import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import logo from '../mongochem.svg';
import './app.css';
import { loadMolecule } from '../redux/ducks/molecules'
import { selectMolecule } from '../redux/ducks/app'
import selectors from '../redux/selectors';
import Molecule from './molecule'


class App extends Component {

  fetchMolecule = () =>  {
    const inchikey = this.props.molecules[0].inchikey;
    const id = this.props.molecules[0].id;
    this.props.dispatch(selectMolecule(id));
    this.props.dispatch(loadMolecule(inchikey));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to MongoChemWeb</h2>
        </div>
        <pre>
          { JSON.stringify(this.props.molecules, null, 2) }
        </pre>
        <Molecule cjson={ this.props.selectedMolecule.cjson } />
        <button onClick={this.fetchMolecule}>Fetch molecule!</button>
      </div>
    );
  }
}

App.propTypes = {
  molecules: PropTypes.array.isRequired,
  selectedMolecule: PropTypes.object,
  modelData: PropTypes.object,
}

App.defaultProps = {
  molecules: [],
  selectedMolecule: {
    cjson: null,
  },
  modelData: {
    atoms: [],
    bonds: []
  }
}

function mapStateToProps(state) {
  let props = {
    molecules: selectors.molecules.getMolecules(state),
  }

  let selectedMolecule = selectors.app.getSelectedMolecule(state);
  if (selectedMolecule != null) {
    props.selectedMolecule = selectedMolecule;
  }

  return props;
}

export default connect(mapStateToProps)(App)
