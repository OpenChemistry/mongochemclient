import * as rest from '../'

export function get(name) {

  return rest.get('group', {
    params: {
      text: name,
      exact: false,
      limit: 50,
      sort: 'name',
      sortdir: 1
    }
  })
  .then(response => response.data )
}
