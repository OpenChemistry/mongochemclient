import { get, post } from '../'

export function fetch(parentId, parentType, name) {

  return get('folder', {
    params: {
      parentId,
      parentType,
      name,
    }
  })
  .then(response => response.data )
}
export function create(parentId, parentType, name, reuseExisting=true) {
  return post('folder', {}, {
    params: {
      parentId,
      parentType,
      name,
      reuseExisting,
    }
  })
  .then(response => response.data )
}