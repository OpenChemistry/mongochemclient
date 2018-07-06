import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import './app.css';
import { selectors } from '@openchemistry/redux';
import NotebooksContainer from '../containers/notebooks';


class App extends Component {
  render() {
    const {me} = this.props;
    return (
        <div>
          { me &&
            <NotebooksContainer/>
          }
        </div>
    );
  }
}

App.propTypes = {
  me: PropTypes.object
}

App.defaultProps = {
  me: null,
}

function mapStateToProps(state) {
  const me = selectors.girder.getMe(state);

  return {
    me,
  }
}

export default connect(mapStateToProps)(App)
