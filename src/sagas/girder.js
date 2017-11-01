import { call, all } from 'redux-saga/effects'
import { item } from '../rest/girder'

export function* listFiles(folderId) {
  const items = yield call(item.list, folderId);

  const calls = []
  for (let i of items) {
    calls.push(call(item.files, i['_id']));
  }

  const files = yield all(calls);

  return [].concat.apply([], files);
}


