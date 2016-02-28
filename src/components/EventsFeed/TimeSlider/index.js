import React, { Component, PropTypes } from 'react';
import { Row, Col, Input } from 'react-bootstrap';
import moment from 'moment';

export default class TimeSlider extends Component {
  static propTypes = {
    selectedDate: PropTypes.object,
    onChange: PropTypes.func
  }

  constructor() {
    super(...arguments);

    const selectedTime = this.props.selectedDate.unix();

    this.state = {
      selectedTime
    };
  }

  render() {
    const { selectedDate, onChange } = this.props;
    const { selectedTime } = this.state;

    const momentTime = moment.unix(selectedTime);
    const date = selectedDate.clone().startOf('day').isSame(moment().startOf('day')) ? moment() : selectedDate.clone().startOf('day');

    return (
      <Row>
        <Col xs={8}>
          <Input
            type="range"
            step={1}
            value={selectedTime}
            min={date.unix()}
            max={date.endOf('day').unix()}
            onChange={(event) => this.setState({selectedTime: event.target.value})}
            onMouseUp={() => onChange(momentTime)}/>
        </Col>
        <Col xs={4} className="margin-sm-v">
          {momentTime.format('h:mmA')}
        </Col>
      </Row>
    );
  }
}
