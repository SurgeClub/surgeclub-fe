/* eslint-disable space-infix-ops */
import moment from 'moment';

export const formatDate = (dateNum) => {
  const dateString = String(dateNum);

  return moment(`${dateString.slice(0, 8)}T${dateString.slice(8)}`).format('ddd hh:mmA');
};

export const parseDate = (date) => {
  return parseInt(date.format('YYYYMMDDHHmm'), 10);
};

export const sortByDate = (array: Array, direction: string = 'down', key = 'startTime'): Array => {
  const multiply = direction === 'desc' ? -1 : 1;

  return array.sort((prev, next) => moment(prev[key]).isBefore(moment(next[key])) ? (-1 * multiply) : (1 * multiply));
};
