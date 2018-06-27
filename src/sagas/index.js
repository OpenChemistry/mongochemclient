import axios from 'axios';
import { put, call, fork, takeEvery, take, select } from 'redux-saga/effects'
import Cookies from 'universal-cookie';

import _ from 'lodash'
import { requestMolecules, receiveMolecules,
         requestMolecule, requestMoleculeById, receiveMolecule,
         LOAD_MOLECULES, LOAD_MOLECULE,
         LOAD_MOLECULE_BY_ID} from '../redux/ducks/molecules.js'

import { requestCalculationById, receiveCalculation, LOAD_CALCULATION_BY_ID,
         requestOrbital, receiveOrbital, LOAD_ORBITAL} from '../redux/ducks/calculations.js'

import { requestUserMe, receiveUserMe, LOAD_USER_ME} from '../redux/ducks/users.js'

import { setAuthenticating, requestOauthProviders, requestTokenInvalidation,
         receiveOauthProviders, loadOauthProviders, setMe, requestMe, newToken,
         receiveMe, requestTokenForApiKey, connectToNotifications, setOauthEnabled,
         authenticated, LOAD_OAUTH_PROVIDERS, INVALIDATE_TOKEN, NEW_TOKEN,
         AUTHENTICATE, LOAD_ME, RECEIVE_NOTIFICATION,  FETCH_TOKEN_FOR_API_KEY,
         AUTHENTICATED, TEST_OAUTH_ENABLED}  from '../redux/ducks/girder.js'

import { requestTaskFlow, receiveTaskFlow, receiveTaskFlowStatus,
         LOAD_TASKFLOW,
         loadJob, requestJob, receiveJob, receiveJobStatus,
         LOAD_JOB }  from '../redux/ducks/cumulus.js'

import selectors from '../redux/selectors';

import { watchNotifications } from './notifications'
import { watchAuthenticateNersc } from './nersc'
import { watchLoadNotebooks } from './app'
import { watchRedirectToJupyterHub, watchInvalidateSession } from './jupyterlab'
import { user, token } from '../rest/girder'
import * as rest from '../rest'
import { girderClient  } from '../rest'
import { watchLoadCalculationNotebooks } from './calculations'

var jp = require('jsonpath')

export function fetchMoleculesFromGirder() {
  return girderClient().get('molecules')
          .then(response => response.data )
}

export function fetchMoleculeFromGirder(inchikey) {
  return girderClient().get(`molecules/inchikey/${inchikey}`)
          .then(response => response.data )
}

export function fetchMoleculeByIdFromGirder(id) {
  return girderClient().get(`molecules/${id}`)
          .then(response => response.data )
}

// Users

export function fetchUserMeFromGirder() {
  return girderClient().get('user/me')
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


export function isValidToken(token) {
  const headers = {
      'Girder-Token': token
  }
  const origin = window.location.origin;

  return axios.get(`${origin}/api/v1/user/me`, {headers})
    .then(response => response.data != null )
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
  return girderClient().get(`calculations/${id}`)
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
  return girderClient().get(`calculations/${id}/cube/${mo}`)
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
  const params = {
    params: {
      redirect
    }
  }
  return girderClient().get(`oauth/provider`, params)
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

export function* testOauthEnabled(action) {
  try {
    yield call(fetchOAuthProvidersFromGirder, 'dummy')
    yield put( setOauthEnabled(true) )
  }
  catch(error) {
    yield put( setOauthEnabled(false) )
  }
}

export function* watchTestOauthEnabled() {
  yield takeEvery(TEST_OAUTH_ENABLED, testOauthEnabled)
}

export function* updateToken(action) {
  const girderToken = action.payload.token;
  if (girderToken !== null) {
    rest.updateToken(girderToken)
  }

  const cookies = new Cookies();
  cookies.set('girderToken', girderToken, {
    path: '/'
  });

  // Reconnect to the event stream using the new token
  yield put(connectToNotifications());
}

export function* watchNewToken() {
  yield takeEvery(NEW_TOKEN, updateToken)
}

export function* authenticate(action) {
  const payload = action.payload;
  const token = payload.token;
  const redirect = payload.redirect;
  let auth = false;
  let me = null;
  yield put(setAuthenticating(true));

  if (!_.isNil(token)) {

    me = yield call(user.fetchMe, token);
    if (me != null) {
      yield put(newToken(token));
      yield put(setMe(me))
      yield put(setAuthenticating(false))
      yield put(authenticated())
      auth = true
    }
  }

  if (!auth) {
    if (redirect) {
      const redirect = window.location.href;
      yield put(loadOauthProviders(redirect));
    }
    else {
      yield put(setAuthenticating(false));
    }
  }
}

export function* watchAuthenticate() {
  yield takeEvery(AUTHENTICATE, authenticate)
}

export function* invalidateToken(action) {
  try {
    yield put( requestTokenInvalidation() )
    yield call(token.invalidate)
    yield put( newToken(null) )
    yield put( setMe(null) )
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

export function* receiveNotification(action) {
  const data = action.payload.data;
  const type = action.payload.type;
  if (type === 'taskflow.status') {
    const _id = data._id;
    const taskflow = yield select(selectors.cumulus.getTaskFlow, _id)

    if (taskflow) {
      // If we have a status then we are keep track of this taskflow
      yield put (receiveTaskFlowStatus(data))
    }
  }
  else if (type === 'job.status') {
    const id = data._id;
    const job = yield select(selectors.cumulus.getJob, id)

    if (job) {
      // If we have a status then we are keep track of this taskflow
      yield put(receiveJobStatus(data))
    }
    // This is a new job
    else if (data.status === 'created') {
      yield put(loadJob({id}));
    }
  }
}

export function* watchNotification() {
  yield takeEvery(RECEIVE_NOTIFICATION, receiveNotification)
}

// TaskFlow

export function fetchTaskFlowFromGirder(id) {
  return girderClient().get(`taskflows/${id}`)
          .then(response => response.data )
}

export function* fetchTaskFlow(action) {
  try {
    const authenticating = yield select(selectors.girder.isAuthenticating);

    // If we are authenticating then wait ...
    if (authenticating) {
      yield take(AUTHENTICATED);
    }

    const _id = action.payload.id;
    yield put( requestTaskFlow(_id) );
    let taskflow = yield call(fetchTaskFlowFromGirder, _id);
    // See if we have any jobs associated with the taskflow and if so load
    // them.
    let jobs = jp.query(taskflow, '$.meta.jobs');
    console.log(jobs);
    if (jobs.length === 1) {
      jobs = jobs[0];

      for( let job of jobs) {
        const id = job._id;
        console.log(id);
        yield put( loadJob({id}));
      }
    }

    yield put( receiveTaskFlow({taskflow}));
  }
  catch(error) {
    console.log(error);
    yield put( requestTaskFlow(error) )
  }
}

export function* watchFetchTaskFlow() {
  yield takeEvery(LOAD_TASKFLOW, fetchTaskFlow)
}

// Job

export function fetchJobFromGirder(id) {
  return girderClient().get(`jobs/${id}`)
          .then(response => response.data )
}

export function* fetchJob(action) {
  try {
    const _id = action.payload.id;
    yield put( requestJob(_id) );
    let job = yield call(fetchJobFromGirder, _id);
    yield put( receiveJob({job}));
  }
  catch(error) {
    yield put( requestJob(error) )
  }
}

export function* watchFetchJob() {
  yield takeEvery(LOAD_JOB, fetchJob)
}

// api key

export function tokenForApiKey(apiKey) {
  const params = {
      key: apiKey,
  }
  return girderClient().post('api_key/token')
          .then(response => response.data, {params})
}

export function* authenticateUsingApiKey(action) {
  try {
    const key = action.payload.key;
    yield put( requestTokenForApiKey(key) );
    let tokenResponse = yield call(tokenForApiKey, key);

    yield put( newToken(tokenResponse.token) );
  }
  catch(error) {
    yield put( requestTokenForApiKey(error) )
  }
}

export function* watchFetchTokenForApiKey() {
  yield takeEvery( FETCH_TOKEN_FOR_API_KEY, authenticateUsingApiKey)
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
  yield fork(watchNotification)
  yield fork(watchFetchTaskFlow)
  yield fork(watchFetchJob)
  yield fork(watchFetchTokenForApiKey)
  yield fork(watchNotifications)
  yield fork(watchAuthenticateNersc)
  yield fork(watchLoadNotebooks)
  yield fork(watchRedirectToJupyterHub)
  yield fork(watchTestOauthEnabled)
  yield fork(watchInvalidateSession)
  yield fork(watchLoadCalculationNotebooks)
}

