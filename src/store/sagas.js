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

import { auth } from '@openchemistry/girder-redux';
import { admin } from '@openchemistry/girder-redux';

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

  yield fork(admin.sagas.watchFetchUsersList)
  yield fork(admin.sagas.watchFetchGroupsList)
  yield fork(admin.sagas.watchFetchMembersList)
  yield fork(admin.sagas.watchRemoveMember)
  yield fork(admin.sagas.watchAddMember)
  yield fork(admin.sagas.watchRemoveGroup)
}
