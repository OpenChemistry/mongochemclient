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
  watchLoadConfiguration,
  watchAsyncOrbital,
  watchLaunchTaskFlow,
  watchRequestUniqueImages,
  watchRegisterImages,
  watchCreateCalculation,
} from '@openchemistry/sagas';

import { auth, admin, user } from '@openchemistry/girder-redux';

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
  yield fork(watchAsyncOrbital)
  yield fork(watchLaunchTaskFlow)
  yield fork(watchRequestUniqueImages)
  yield fork(watchRegisterImages)
  yield fork(watchCreateCalculation)

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

  yield fork(user.sagas.watchFetchUserInformation);
  yield fork(user.sagas.watchUpdateUserInformation);
  yield fork(user.sagas.watchTwitterLogin);
  yield fork(user.sagas.watchOrcidLogin);
  yield fork(user.sagas.watchApiKeyEdited);
  yield fork(user.sagas.watchApiKeyCreated);
  yield fork(user.sagas.watchApiKeyDeleted);
  yield fork(user.sagas.watchApiKeyRequested);
}
