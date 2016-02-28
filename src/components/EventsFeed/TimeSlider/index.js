import React, { Component, PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import moment from 'moment';

export default class TimeSlider extends Component {
  static propTypes = {
    selectedDate: PropTypes.object,
    onChange: PropTypes.func
  }


  constructor() {
    super(...arguments);

    const selectedTime = parseInt(this.props.selectedDate.format('HHmm'), 10);

    this.state = {
      selectedTime: selectedTime.toString().slice(0, 2) + parseInt(selectedTime.toString().slice(2), 10) * 100 / 60
    };
  }

  render() {
    const { selectedDate, onChange } = this.props;
    const { selectedTime } = this.state;
    const styles = require('./style.scss');
    const slicedMinute = selectedTime.toString().slice(2);
    const roundedMinute = Math.floor(slicedMinute / 100 * 60).toString();
    const selectedMinute = roundedMinute.length > 1 ? roundedMinute : `0${roundedMinute}`;
    const momentTime = moment(`${selectedDate.format('YYYYMMDD')}T${selectedTime.toString().slice(0, 2)}${selectedMinute}`);
    const selectedDateStartOfDay = selectedDate.clone().startOf('day');
    const isToday = selectedDateStartOfDay.isSame(moment().startOf('day'));
    const minValue = isToday ? parseInt(moment().format('HHmm'), 10) : parseInt(selectedDateStartOfDay.format('HHmm'), 10);

    return (
      <div className={styles.timeAndSliderContainer}>
        <div className={styles.sliderContainer}>
          <p>Slide to see predicted surge</p>
          <Input
            type="range"
            className="slider"
            step={1}
            value={selectedTime}
            min={minValue}
            max={parseInt(selectedDate.clone().endOf('day').format('HHmm'), 10)}
            onChange={(event) => this.setState({selectedTime: event.target.value})}
            onMouseUp={() => onChange(momentTime)}/>
        </div>
        <hr />
        <div className={styles.time}>
          {momentTime.format('h:mmA')}
        </div>
        <hr />
      </div>
    );
  }
}
