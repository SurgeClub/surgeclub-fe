import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { firebase as firebaseConnect, helpers } from 'redux-react-firebase';
const { isLoaded, dataToJS } = helpers;

import { formatDate, parseDate } from 'helpers/numberedDate';

@firebaseConnect()
@connect(
  ({ firebase }) => {
    return {
      events: dataToJS(firebase, 'events')
    };
  }
)
export default class EventsFeed extends Component {
  static propTypes = {
    firebase: PropTypes.object,
    events: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {
    startDate: moment()
  }

  componentWillMount() {
    this.getEvents();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.events !== nextProps.events || !this.state.startDate.isSame(nextState.startDate);
  }

  onDateChange(date) {
    this.setState({startDate: date}, () => {
      this.getEvents();
    });
  }

  getEvents() {
    const { dispatch, firebase } = this.props;
    const { startDate } = this.state;
    // This is bad. Don't do this please.
    firebase.ref
      .child('events')
      .orderByChild('startTime')
      .startAt(parseDate(startDate))
      .endAt(parseDate(startDate.clone().add(1, 'days')))
      .on('child_added', (snapshot) => {
        dispatch({
          type: '@@reactReduxFirebase/SET',
          path: `events/${snapshot.key()}`,
          data: snapshot.val()
        });
      });
  }

  renderFeed() {
    const { events } = this.props;
    const { startDate } = this.state;

    return isLoaded(events) && Object.keys(events).reduce((array, eventId) => {
      const event = events[eventId];

      if (event.startTime < parseDate(startDate) || event.startTime > parseDate(startDate.clone().add(1, 'days'))) {
        // The user clicked around and now we have events that should not be on the screen
        return array;
      }

      return array.concat((
        <Row className="margin-sm-v" key={eventId}>
          <Col xs={2} style={{height: 100, background: `url(${event.imageUrl}) center center no-repeat`, backgroundSize: 'cover'}} />
          <Col xs={7}>
            <h4 className="margin-sm-top">
              {event.title}
            </h4>
            <a href={`https://www.google.com/maps/place/${event.address}`}>
              {event.venueName ? event.venueName : event.address}
            </a>
          </Col>
          <Col xs={3} className="margin-md-top">
            {event.startTime ? formatDate(event.startTime) : null} {event.stopTime ? `- ${formatDate(event.stopTime)}` : null}
          </Col>
        </Row>
      ));
    }, []);
  }

  render() {
    return (
      <Row>
        <Col xs={12} md={4} mdOffset={4}>
          <DatePicker
            className="text-center margin-sm-bottom"
            dateFormat="LLLL"
            selected={this.state.startDate}
            onChange={this.onDateChange.bind(this)} />
        </Col>
        <Col xs={12} md={12}>
          {this.renderFeed()}
        </Col>
      </Row>
    );
  }
}
