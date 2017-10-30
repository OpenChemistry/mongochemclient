import { get } from '../'

export function fetchProviders(redirect) {
  return get('oauth/provider', {
    params: {
      redirect
    }
  })
  .then(response => response.data )
}
