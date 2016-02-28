import React, { Component, PropTypes } from 'react';
import { Panel, Accordion, ButtonGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { GoogleMapLoader, GoogleMap, OverlayView } from 'react-google-maps';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { firebase as firebaseConnect, helpers } from 'redux-react-firebase';
const { isLoaded, dataToJS } = helpers;

// helpers
import { formatDate, parseDate, sortByDate } from 'helpers/numberedDate';

// components
import TimeSlider from './TimeSlider';

const styles = require('./style.scss');

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
    show: 'map',
    selectedDate: moment()
  }

  componentWillMount() {
    this.getEvents();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.events !== nextProps.events || !this.state.selectedDate.isSame(nextState.selectedDate);
  // }

  onDateChange(date) {
    this.setState({selectedDate: date}, () => {
      this.getEvents();
    });
  }

  getEvents() {
    const { dispatch, firebase } = this.props;
    const { selectedDate } = this.state;
    // This is bad. Don't do this please.
    firebase.ref
      .child('events')
      .orderByChild('startTime')
      .startAt(parseDate(selectedDate))
      .endAt(parseDate(selectedDate.clone().add(1, 'days')))
      .on('child_added', (snapshot) => {
        dispatch({
          type: '@@reactReduxFirebase/SET',
          path: `events/${snapshot.key()}`,
          data: snapshot.val()
        });
      });
  }

  eventsArray() {
    const { events } = this.props;
    const { selectedDate } = this.state;

    if (!isLoaded(events)) {
      return [];
    }

    const filteredEvents = Object.keys(events).reduce((array, eventId) => {
      const event = events[eventId];

      if (event.startTime < parseDate(selectedDate) || event.startTime > parseDate(selectedDate.clone().add(1, 'days'))) {
        // The user clicked around and now we have events that should not be on the screen
        return array;
      }

      return array.concat(event);
    }, []);

    return sortByDate(filteredEvents, 'asc');
  }

  renderFakeData() {
    const fakeData = {};
    fakeData.surgeNubmer = 7.5;
    fakeData.time = '7:30pm';
    fakeData.venue = 'The Chapel';
    fakeData.eventTitle = 'Taylor Swift';
    return (
      <div>
        <div className={styles.eventWrapper}>
          <div className={styles.surgeWrapper}>
            <h3>Surge Rating</h3>
            <div className={styles.surgeNubmer}>
              <p>{fakeData.surgeNubmer}</p>
            </div>
          </div>
          <div className={styles.timeWrapper}>
            <h3>Time</h3>
            <div className={styles.timeNubmer}>
              <p>{fakeData.time}</p>
            </div>
          </div>
          <div className={styles.eventTitleWrapper}>
            <h3>Title</h3>
            <div className={styles.eventTitle}>
              {fakeData.eventTitle}
            </div>
          </div>
          <div className={styles.venueWrapper}>
            <h3>Venue</h3>
            <div className={styles.venueTitle}>
                {fakeData.venue}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderFeed() {
    return this.eventsArray().map(event => (
      <div key={event.id}>
        <div className={styles.eventWrapper}>
          <div className={styles.surgeWrapper}>
            <h3>Surge Rating</h3>
            <div className={styles.surgeNubmer}>
              <p></p>
            </div>
          </div>
          <div className={styles.timeWrapper}>
            {event.startTime ? formatDate(event.startTime) : null} {event.stopTime ? `- ${formatDate(event.stopTime)}` : null}
          </div>
          <div className={styles.eventTitleWrapper}>
            {event.title}
          </div>
          <div className={styles.venueWrapper}>
            <a href={`https://www.google.com/maps/place/${event.address}`} target="_blank">
              {event.venueName ? event.venueName : event.address}
            </a>
          </div>
        </div>

      </div>
    ));
  }

  renderMap() {
    const overlays = this.eventsArray().map(event => {
      const popover = (
        <Popover id={`${event.id}-event`} title={`${formatDate(event.startTime)} - ${event.venueName}`}>
          {event.title}
        </Popover>
      );

      return (
        <OverlayView
          position={{lat: event.latitude, lng: event.longitude}}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          key={event.id}>
          <OverlayTrigger trigger={['focus', 'hover']} placement="top" overlay={popover}>
            <div className={styles.overlay}/>
          </OverlayTrigger>
        </OverlayView>
      );
    });

    return (
      <section style={{height: 500}}>
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props}
              style={{
                height: '100%',
              }}
            />
          }
          googleMapElement={
            <GoogleMap
              defaultZoom={12}
              defaultCenter={{lat: 37.7833, lng: -122.4167}}>
              {overlays}
            </GoogleMap>
          }
        />
    </section>
    );
  }

  render() {
    const { show, selectedDate } = this.state;

    return (
      <div>
        <h3>Choose a date:</h3>
        <div className={styles.datepickerContainer}>
          <DatePicker
            className="text-center margin-sm-bottom"
            dateFormat="LL"
            selected={selectedDate}
            onChange={this.onDateChange.bind(this)} />
        </div>
        <div className={styles.viewChoicesContainer}>
          <ButtonGroup>
            <Button active={show === 'feed'} onClick={() => this.setState({show: 'feed'})}>Calendar</Button>
            <Button active={show === 'map'} onClick={() => this.setState({show: 'map'})}>Map</Button>
          </ButtonGroup>
        </div>
        <div className={styles.timeSliderContainer}>
          <TimeSlider
            selectedDate={selectedDate}
            onChange={(momentTime) => this.setState({selectedDate: momentTime})} />
        </div>
        <div className={styles.mapOrFeedContainer}>
          <Accordion>
            <Panel header="Sunday">
              {show === 'feed' ? this.renderFakeData() : this.renderMap()}
            </Panel>
          </Accordion>
        </div>
      </div>
    );
  }
}
