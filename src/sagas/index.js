import axios from 'axios';
import { put, call, fork, takeEvery } from 'redux-saga/effects'
import { requestMolecules, receiveMolecules,
         requestMolecule, requestMoleculeById, receiveMolecule,
         LOAD_MOLECULES, LOAD_MOLECULE,
         LOAD_MOLECULE_BY_ID} from '../redux/ducks/molecules.js'

import { requestCalculationById, receiveCalculation, LOAD_CALCULATION_BY_ID,
         requestOrbital, receiveOrbital, LOAD_ORBITAL} from '../redux/ducks/calculations.js'


export function fetchMoleculesFromGirder() {
  let origin = window.location.origin;
  return axios.get(`${origin}/api/v1/molecules`)
          .then(response => response.data )
}

export function fetchMoleculeFromGirder(inchikey) {
  let origin = window.location.origin;
  return axios.get(`${origin}/api/v1/molecules/inchikey/${inchikey}`)
          .then(response => response.data )
}

export function fetchMoleculeByIdFromGirder(id) {
  let origin = window.location.origin;
  return axios.get(`${origin}/api/v1/molecules/${id}`)
          .then(response => response.data )
}

export function* fetchMolecules() {
  try {
    yield put( requestMolecules() )
    const molecules = yield call(fetchMoleculesFromGirder)
    yield put( receiveMolecules(molecules) )
  }
  catch(error) {
    yield put( requestMolecules(error) )
  }
}

export function* fetchMolecule(action) {
  try {
    yield put( requestMolecule(action.payload.inchikey) )
    const molecule = yield call(fetchMoleculeFromGirder, action.payload.inchikey)
    yield put( receiveMolecule(molecule) )
  }
  catch(error) {
    yield put( requestMolecule(error) )
  }
}

export function* fetchMoleculeById(action) {
  try {
    yield put( requestMoleculeById(action.payload.id) )
    const molecule = yield call(fetchMoleculeByIdFromGirder, action.payload.id)
    yield put( receiveMolecule(molecule) )
  }
  catch(error) {
    yield put( requestMoleculeById(error) )
  }
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

export function fetchCalculationByIdFromGirder(id) {
  let origin = window.location.origin;
  return axios.get(`${origin}/api/v1/calculations/${id}`)
          .then(response => response.data )
}
export function* fetchCalculationById(action) {
  try {
    yield put( requestCalculationById(action.payload.id) )
    const calculation = yield call(fetchCalculationByIdFromGirder, action.payload.id)
    yield put( receiveCalculation(calculation) )
  }
  catch(error) {
    yield put( requestCalculationById(error) )
  }
}

export function* watchFetchCalculationById() {
  yield takeEvery(LOAD_CALCULATION_BY_ID, fetchCalculationById)
}

// mo
export function fetchOrbitalFromGirder(id, mo) {
  let origin = window.location.origin;
  return axios.get(`${origin}/api/v1/calculations/${id}/cube/${mo}`)
          .then(response => response.data )
}
export function* fetchOrbital(action) {
  try {
    yield put( requestOrbital(action.payload.id, action.payload.mo) )
    const orbital = yield call(fetchOrbitalFromGirder, action.payload.id, action.payload.mo)
    yield put( receiveOrbital(action.payload.id, action.payload.mo, orbital) )
  }
  catch(error) {
    yield put(  requestOrbital(error) )
  }
}

export function* watchFetchOrbital() {
  yield takeEvery(LOAD_ORBITAL, fetchOrbital)
}

export default function* root() {
  yield fork(fetchMolecules)
  yield fork(watchFetchMolecules)
  yield fork(watchFetchMolecule)
  yield fork(watchFetchMoleculeById)
  yield fork(watchFetchCalculationById)
  yield fork(watchFetchOrbital)
}

