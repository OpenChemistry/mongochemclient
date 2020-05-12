import moment from 'moment';

export function formatTime(s) {
  return moment(s).format('MMM D, YYYY, h:mm A');
};
