import moment from 'moment';

export function fromNow(s) {
  return moment.parseZone(s).fromNow();
};

export function formatDate(s) {
  return moment(s).format('MMM D, YYYY, h:mm A');
};
