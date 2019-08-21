import { fork } from 'redux-saga/effects';

import {
  watchFetchMolecules,
  watchFetchMolecule,
  watchFetchMoleculeById,
  watchFetchCalculationById,
  watchFetchOrbital,
  watchNotification,
  watchFetchTaskFlow,
  watchFetchJob,
  watchNotifications,
  watchLoadNotebooks,
  watchRedirectToJupyterHub,
  watchInvalidateSession,
  watchInvalidateToken,
  watchLoadCalculationNotebooks,
  watchLoadCalculations,
  watchLoadConfiguration
} from '@openchemistry/sagas';

import { auth, user } from '@openchemistry/girder-redux';

export default function* root() {
  yield fork(watchFetchMolecules)
  yield fork(watchFetchMolecule)
  yield fork(watchFetchMoleculeById)
  yield fork(watchFetchCalculationById)
  yield fork(watchFetchOrbital)
  yield fork(watchNotification)
  yield fork(watchFetchTaskFlow)
  yield fork(watchFetchJob)
  yield fork(watchNotifications)
  yield fork(watchLoadNotebooks)
  yield fork(watchRedirectToJupyterHub)
  yield fork(watchInvalidateSession)
  yield fork(watchInvalidateToken)
  yield fork(watchLoadCalculationNotebooks)
  yield fork(watchLoadCalculations)
  yield fork(watchLoadConfiguration)

  yield fork(auth.sagas.watchAuthenticate);
  yield fork(auth.sagas.watchFetchMe);
  yield fork(auth.sagas.watchFetchOauthProviders);
  yield fork(auth.sagas.watchTestOauthEnabled);
  yield fork(auth.sagas.watchInvalidateToken);
  yield fork(auth.sagas.watchNewToken);
  yield fork(auth.sagas.watchUsernameLogin);
  yield fork(auth.sagas.watchNerscLogin);
  yield fork(auth.sagas.watchFetchApiKey);

  yield fork(user.sagas.watchFetchUserInformation);
  yield fork(user.sagas.watchUpdateUserInformation);
  yield fork(user.sagas.watchTwitterLogin);
  yield fork(user.sagas.watchOrcidLogin);
}
