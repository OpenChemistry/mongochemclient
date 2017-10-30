import _ from 'lodash'

import { get } from '../'


export function fetchMe(token) {
  const params = {

  }

  if (!_.isNil(token)) {
    params.headers = {
      'Girder-Token': token
    }
  }

  return get('user/me', params)
    .then(response => response.data)
}
