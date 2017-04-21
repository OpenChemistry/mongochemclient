import axios from 'axios';
import { put, call, fork, takeEvery } from 'redux-saga/effects'
import { requestMolecules, receiveMolecules,
         requestMolecule, requestMoleculeById, receiveMolecule,
         LOAD_MOLECULES, LOAD_MOLECULE,
         LOAD_MOLECULE_BY_ID} from '../redux/ducks/molecules.js'

export function fetchMoleculesFromGirder() {
  let origin = window.location.origin;
  return axios.get(`${origin}/api/v1/molecules`)
          .then(response => response.data )
          .catch( error => console.error(error) )
}

export function fetchMoleculeFromGirder(inchikey) {
  let origin = window.location.origin;
  return axios.get(`${origin}/api/v1/molecules/inchikey/${inchikey}`)
          .then(response => response.data )
          .catch( error => console.error(error) )
}

export function fetchMoleculeByIdFromGirder(id) {
  let origin = window.location.origin;
  return axios.get(`${origin}/api/v1/molecules/${id}`)
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

export function* fetchMoleculeById(action) {
  yield put( requestMoleculeById(action.payload.id) )
  const molecule = yield call(fetchMoleculeByIdFromGirder, action.payload.id)
  yield put( receiveMolecule(molecule) )
}

export function* watchFetchMolecules() {
  yield takeEvery(LOAD_MOLECULES, fetchMolecules)
}

export function* watchFetchMolecule() {
  yield takeEvery(LOAD_MOLECULE, fetchMolecule)
}

export function* watchFetchMoleculeById() {
  yield takeEvery(LOAD_MOLECULE_BY_ID, fetchMoleculeById)
}

export default function* root() {
  yield fork(fetchMolecules)
  yield fork(watchFetchMolecules)
  yield fork(watchFetchMolecule)
  yield fork(watchFetchMoleculeById)
}

