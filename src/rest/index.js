import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga'
import _ from 'lodash'
import * as girder from './girder'
import * as jupyterhub from './jupyterhub'


var _girderClient = axios.create({
  baseURL: `${window.location.origin}/api/v1`
});

export function get(url, config) {
  const source = CancelToken.source()
  const request = _girderClient.get(url, { cancelToken: source.token, ...config })
  request[CANCEL] = () => source.cancel()
  return request
}

export function post(url, data, config) {
  const source = CancelToken.source()
  const request = _girderClient.post(url, data, { ...config, cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request
}

export function put(url, data, config) {
  const source = CancelToken.source()
  const request = _girderClient.put(url, data, { ...config, cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request
}

export function patch(url, data, config) {
  const source = CancelToken.source()
  const request = _girderClient.patch(url, data, { ...config, cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request
}

export function girderClient() {
  return _girderClient;
}

export function updateToken(token) {
  const headers = {
    'Girder-Token': token
  }

  _girderClient = axios.create({
    headers,
    baseURL: `${window.location.origin}/api/v1`
  });
}

export {
  girder,
  jupyterhub
}

