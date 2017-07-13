import axios from 'axios';
import { put, call, fork, takeEvery } from 'redux-saga/effects'
import Cookies from 'universal-cookie';
import { requestMolecules, receiveMolecules,
         requestMolecule, requestMoleculeById, receiveMolecule,
         LOAD_MOLECULES, LOAD_MOLECULE,
         LOAD_MOLECULE_BY_ID} from '../redux/ducks/molecules.js'

import { requestCalculationById, receiveCalculation, LOAD_CALCULATION_BY_ID,
         requestOrbital, receiveOrbital, LOAD_ORBITAL} from '../redux/ducks/calculations.js'

import { requestUserMe, receiveUserMe, LOAD_USER_ME} from '../redux/ducks/users.js'

import { setAuthenticating, requestOauthProviders, requestTokenInvalidation,
         receiveOauthProviders, loadOauthProviders, newToken, setMe, requestMe,
         receiveMe, LOAD_OAUTH_PROVIDERS,
         INVALIDATE_TOKEN, NEW_TOKEN, AUTHENTICATE, LOAD_ME}  from '../redux/ducks/girder.js'

import selectors from '../redux/selectors';


var girderClient = axios.create({
  baseURL: window.location.origin,
});

export function fetchMoleculesFromGirder() {
  let origin = window.location.origin;
  return girderClient.get(`${origin}/api/v1/molecules`)
          .then(response => response.data )
}

export function fetchMoleculeFromGirder(inchikey) {
  let origin = window.location.origin;
  return girderClient.get(`${origin}/api/v1/molecules/inchikey/${inchikey}`)
          .then(response => response.data )
}

export function fetchMoleculeByIdFromGirder(id) {
  let origin = window.location.origin;
  return girderClient.get(`${origin}/api/v1/molecules/${id}`)
          .then(response => response.data )
}

// Users

export function fetchUserMeFromGirder() {
  let origin = window.location.origin;
  return girderClient.get(`${origin}/api/v1/user/me`)
          .then(response => response.data )
}

export function* fetchUserMe(action) {
  try {
    yield put( requestUserMe() )
    const me = yield call(fetchUserMeFromGirder)
    yield put( receiveUserMe(me) )
  }
  catch(error) {
    yield put( requestUserMe(error) )
  }
}

export function* watchFetchUserMe() {
  yield takeEvery(LOAD_USER_ME, fetchUserMe)
}

// Molecules

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
  return girderClient.get(`${origin}/api/v1/calculations/${id}`)
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
  return girderClient.get(`${origin}/api/v1/calculations/${id}/cube/${mo}`)
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

// Auth

// Fetch OAuth providers
export function fetchOAuthProvidersFromGirder(redirect) {
  let origin = window.location.origin;
  const params = {
    params: {
      redirect
    }
  }
  return girderClient.get(`${origin}/api/v1/oauth/provider`, params)
    .then(response => response.data )
}

export function* fetchOauthProviders(action) {
  try {
    yield put( requestOauthProviders() )
    const providers = yield call(fetchOAuthProvidersFromGirder, action.payload)
    yield put( receiveOauthProviders(providers) )
  }
  catch(error) {
    yield put(  requestOauthProviders(error) )
  }
}

export function* watchFetchOauthProviders() {
  yield takeEvery(LOAD_OAUTH_PROVIDERS, fetchOauthProviders)
}

export function updateGirderAxiosClient(action) {
  const headers = {}

  if (action.payload.token !== null) {
    headers['Girder-Token'] = action.payload.token;
  }

  girderClient = axios.create({
    headers,
  });
}

export function* watchNewToken() {
  yield takeEvery(NEW_TOKEN, updateGirderAxiosClient)
}

export function* authenticate(payload) {
  const token = payload.token;
  var auth = false;
  yield put(setAuthenticating(true));

  // Check to see if we have a cookie
  const cookies = new Cookies();
  const cookieToken = cookies.get('girderToken');

  if (cookieToken != null && cookieToken !== token) {
    yield put(newToken(cookieToken));
  }

  const me = yield call(fetchUserMeFromGirder)
  if (me !== null) {
    auth = true;
    yield put(setAuthenticating(false))
    yield put(setMe(me))
    console.log(me);
  }

  if (!auth) {
    const redirect = window.location.href;
    yield put(loadOauthProviders(redirect));
  }
}

export function* watchAuthenticate() {
  yield takeEvery(AUTHENTICATE, authenticate)
}

export function invalidateGirderToken() {
  let origin = window.location.origin;
  return girderClient.delete(`${origin}/api/v1/token/session`)
          .then(response => response.data )
}

export function* invalidateToken(action) {
  try {
    yield put( requestTokenInvalidation() )
    yield call(invalidateGirderToken)
    yield put( newToken(null) )
  }
  catch(error) {
    yield put( requestTokenInvalidation(error) )
  }
}

export function* watchInvalidateToken() {
  yield takeEvery(INVALIDATE_TOKEN, invalidateToken)
}

export function* fetchMe(action) {
  try {
    yield put( requestMe() )
    const me = yield call(fetchUserMeFromGirder)
    yield put( receiveMe(me) )
  }
  catch(error) {
    yield put( requestMe(error) )
  }
}

export function* watchFetchMe() {
  yield takeEvery(LOAD_ME, fetchMe)
}

export default function* root() {
  yield fork(watchFetchMolecules)
  yield fork(watchFetchMolecule)
  yield fork(watchFetchMoleculeById)
  yield fork(watchFetchCalculationById)
  yield fork(watchFetchOrbital)
  yield fork(watchFetchOauthProviders)
  yield fork(watchInvalidateToken)
  yield fork(watchNewToken)
  yield fork(watchAuthenticate)
  yield fork(watchFetchMe)

}

