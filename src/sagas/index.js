import axios from 'axios';
import { put, call, fork, takeEvery } from 'redux-saga/effects'
import { requestMolecules, receiveMolecules,
         requestMolecule, receiveMolecule,
         LOAD_MOLECULES, LOAD_MOLECULE} from '../redux/ducks/molecules.js'

export function fetchMoleculesFromGirder() {
  let href = window.location.href;
  return axios.get(`${href}/api/v1/molecules`)
          .then(response => response.data )
          .catch( error => console.error(error) )
}

export function fetchMoleculeFromGirder(inchikey) {
  let href = window.location.href;
  return axios.get(`${href}/api/v1/molecules/inchikey/${inchikey}`)
          .then(response => response.data )
          .catch( error => console.error(error) )
}

export function* fetchMolecules() {
  yield put( requestMolecules() )
  const molecules = yield call(fetchMoleculesFromGirder)
  yield put( receiveMolecules(molecules) )
}

export function* fetchMolecule(action) {
  yield put( requestMolecule(action.payload.inchikey) )
  const molecule = yield call(fetchMoleculeFromGirder, action.payload.inchikey)
  yield put( receiveMolecule(molecule) )
}


export function* watchFetchMolecules() {
  yield takeEvery(LOAD_MOLECULES, fetchMolecules)
}

export function* watchFetchMolecule() {
  yield takeEvery(LOAD_MOLECULE, fetchMolecule)
}

export default function* root() {
  yield fork(fetchMolecules)
  yield fork(watchFetchMolecules)
  yield fork(watchFetchMolecule)
}

