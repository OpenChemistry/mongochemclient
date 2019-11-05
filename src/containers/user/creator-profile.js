import React, { Component } from 'react';

import CreatorProfile from '../../components/user/creator-profile';

class CreatorContainer extends Component {
  render() {
    console.log('CreatorContainer - Client')
    return (
      <CreatorProfile {...this.props}/>
    )
  }
}

export default CreatorContainer;