import axios from 'axios';
import { put, call, fork } from 'redux-saga/effects'
import { requestMolecules, receiveMolecules } from '../redux/ducks/molecules.js'

export function fetchMoleculeFromGirder() {
  let href = window.location.href;
  return axios.get(`${href}/api/v1/molecules`)
          .then(response => response.data )
          .catch( error => console.error(error) )
}

export function* fetchMolecules() {
  yield put( requestMolecules() )
  const molecules = yield call(fetchMoleculeFromGirder)
  yield put( receiveMolecules(molecules) )
}


export default function* root() {
  yield fork(fetchMolecules);
}
