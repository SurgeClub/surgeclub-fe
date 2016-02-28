import React, { Component, PropTypes } from 'react';
import DatePickerComponent from 'react-datepicker';

export default class DatePicker extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    selectedDate: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return !this.props.selectedDate.clone().startOf('day').isSame(nextProps.selectedDate.clone().startOf('day'));
  }

  render() {
    const { selectedDate, onChange } = this.props;

    return (
      <DatePickerComponent
        className="text-center margin-sm-bottom"
        dateFormat="LL"
        selected={selectedDate}
        onChange={onChange} />
    );
  }
}
