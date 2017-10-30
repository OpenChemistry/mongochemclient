import { girderClient } from '../'

export function invalidate() {
  return girderClient().delete(`token/session`)
         .then(response => response.data )
}

