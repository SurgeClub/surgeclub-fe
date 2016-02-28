import React from 'react';
import { Row, Col, Input } from 'react-bootstrap';
import moment from 'moment';

export default ({ selectedDate, onChange }) => {
  const selectedTime = selectedDate.unix();
  const momentTime = moment.unix(selectedTime);
  const date = selectedDate.clone().startOf('day').isSame(moment().startOf('day')) ? moment() : selectedDate.clone().startOf('day');
  const onChangeEvent = (event) => {
    return onChange(moment.unix(event.target.value));
  };

  return (
    <Row>
      <Col xs={8}>
        <Input
          type="range"
          step={15}
          value={selectedTime}
          min={date.unix()}
          max={date.endOf('day').unix()}
          onChange={onChangeEvent} />
      </Col>
      <Col xs={4} className="margin-sm-v">
        {momentTime.format('h:mmA')}
      </Col>
    </Row>
  );
};
