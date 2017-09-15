import { take, put, call, fork } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import _ from 'lodash'

import {CONNECT_TO_NOTIFICATIONS, receiveNotification, eventSourceError} from '../../redux/ducks/girder'

function createEventSource() {
  return eventChannel(emit => {
    const origin = window.location.origin;
    const eventSource = new EventSource(`${origin}/api/v1/notification/stream`);
    eventSource.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      emit(msg);
    };

    eventSource.onerror = (e) => {
      emit({
        error: e
      });
    };

    const close = () => {
      eventSource.close();
    };

    return close;
  })
}

function* receiveEvents(eventSourceChannel) {
  while (true) {
    const payload = yield take(eventSourceChannel)
    if (_.has(payload, 'error')) {
      yield put(eventSourceError(payload));
    }
    else {
      yield put(receiveNotification(payload));
    }
  }
}

export function* watchNotifications() {

  let eventSourceChannel = null;

  while (true) {
    yield take(CONNECT_TO_NOTIFICATIONS)

    if (!_.isNil(eventSourceChannel)) {
      eventSourceChannel.close()
    }

    eventSourceChannel = yield call(createEventSource)

    yield fork(receiveEvents, eventSourceChannel);
  }
}
