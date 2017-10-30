import axios from 'axios';
import { put, call, takeEvery } from 'redux-saga/effects'
import Cookies from 'universal-cookie';

import { authenticateWithNewt, AUTHENTICATE_NERSC  }  from '../redux/ducks/nersc'
import { setAuthenticating, newToken, setMe, authenticated }  from '../redux/ducks/girder'
import { showNerscLogin }  from '../redux/ducks/app'
var girderClient = axios.create({
  baseURL: window.location.origin,
});


export function authenticateNewt(username, password) {
  const data = new FormData()
  data.set('username', username)
  data.set('password', password)

  return axios.post('https://newt.nersc.gov/newt/auth/', data)
    .then(response => response.data)
}

export function authenticateWithGirder(sessionId) {
  return girderClient.put(`api/v1/newt/authenticate/${sessionId}`)
    .then(response => response.data)
}

export function* authenticateWithNersc(action) {
  const {username, password, reject, resolve} = action.payload;

  try {
    yield put(setAuthenticating(true));
    yield put( authenticateWithNewt() )

    const {auth, newt_sessionid} = yield call(authenticateNewt, username, password)
    if (!auth) {
      throw Error('Invalid username or password.');
    }
    else {
      const me = yield call(authenticateWithGirder, newt_sessionid);
      const cookies = new Cookies();
      const token = cookies.get('girderToken');

      yield put(newToken(token));
      yield put(setMe(me));
      yield put(setAuthenticating(false));
      yield put(authenticated());
      yield put(showNerscLogin(false));
    }

    resolve();
  }
  catch(error) {
    console.log(error)
    yield put(  yield put( authenticateWithNewt(error) ))
    reject(error)
  }
}

export function* watchAuthenticateNersc() {
  yield takeEvery(AUTHENTICATE_NERSC, authenticateWithNersc)
}

