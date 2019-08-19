import React, { Component } from 'react';
import { connect } from 'react-redux';

import MemberManager from '../../components/administrator/member-manager';

class MemberManagerContainer extends Component {
  render() {
    return (
      <MemberManager />
    )
  }
}

function mapStateToProps(state) {
}

export default connect(mapStateToProps)(MemberManagerContainer);
