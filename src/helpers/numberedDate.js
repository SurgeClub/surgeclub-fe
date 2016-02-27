import moment from 'moment';

export const formatDate = (dateNum) => {
  const dateString = String(dateNum);

  return moment(`${dateString.slice(0, 8)}T${dateString.slice(8)}`).format('ddd hh:mmA');
};

export const parseDate = (date) => {
  return parseInt(date.format('YYYYMMDDHHmm'), 10);
};
