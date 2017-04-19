import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import logo from './mongochem.svg';
import './app.css';
import { loadMolecules } from './redux/ducks/molecules'
import selectors from './redux/selectors';

class App extends Component {

  constructor(props) {
    super(props)
    this.props.dispatch(loadMolecules())
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
      </div>
    );
  }
}

App.propTypes = {
  molecules: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
  return {
    molecules: selectors.molecules.getMolecules(state)
  }
}


export default connect(mapStateToProps)(App)
