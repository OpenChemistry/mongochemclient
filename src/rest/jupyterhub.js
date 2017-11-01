import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga'

export function authenticate(girderToken) {
  const source = CancelToken.source()
  const data = new FormData()
  data.set('Girder-Token', girderToken)
  const request = axios.post(`${window.location.origin}/jupyterhub/hub/login?next=`,
      data, { cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request.then(response => response.request.responseURL);
}
