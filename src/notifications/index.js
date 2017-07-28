import {receiveNotification} from '../redux/ducks/girder'

export function connectToNotificationStream(store) {
  if (EventSource) {
    const origin = window.location.origin;
    let eventSource = new EventSource(`${origin}/api/v1/notification/stream`);
    eventSource.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      store.dispatch(receiveNotification(msg));
    };

    eventSource.onerror = (e) => {
      // Wait 2 seconds if the browser hasn't reconnected then reinitialize.
      setTimeout(() => {
        if (eventSource && eventSource.readyState === EventSource.CLOSED) {
          connectToNotificationStream();
        } else {
          eventSource.close();
          eventSource = null;
          connectToNotificationStream(store);
        }
      }, 2000);
    };
  }
}

