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

export function logout() {
  const source = CancelToken.source()
  const request = axios.get(`${window.location.origin}/jupyterhub/hub/logout`,
      { cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request.then(response => response.request.responseURL);
}

export function stopServer(login) {
  const source = CancelToken.source()
  const request = axios.delete(`${window.location.origin}/jupyterhub/hub/api/users/${login}/server`,
      { cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request.then(response => response.request.responseURL);

}
