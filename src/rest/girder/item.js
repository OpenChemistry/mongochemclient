import { get } from '../'

export function list(folderId) {

  return get('item', {
    params: {
      folderId
    }
  })
  .then(response => response.data )
}

export function files(itemId) {

  return get(`item/${itemId}/files`)
  .then(response => response.data )
}
