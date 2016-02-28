import React, { Component, PropTypes } from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { firebase as firebaseConnect, helpers } from 'redux-react-firebase';
const { dataToJS } = helpers;

// components
import TimeSlider from './TimeSlider';

let peaksHeatmap;
let valleysHeatmap;

@firebaseConnect()
@connect(
  ({ firebase }) => {
    return {
      peaks: dataToJS(firebase, 'peaks'),
      valleys: dataToJS(firebase, 'valleys')
    };
  }
)
export default class EventsFeed extends Component {
  static propTypes = {
    firebase: PropTypes.object,
    valleys: PropTypes.object,
    peaks: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {
    show: 'map',
    selectedDate: moment()
  }

  componentWillMount() {
    this.getData();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.surges !== nextProps.surges || !this.state.selectedDate.isSame(nextState.selectedDate);
  // }

  onDateChange(date) {
    this.setState({selectedDate: date}, () => {
      this.getData();
    });
  }

  getFirebaseData(path) {
    const { dispatch, firebase } = this.props;
    // const { selectedDate } = this.state;
    // This is bad. Don't do this please.
    firebase.ref
      .child(path)
      .orderByChild('rating')
      .on('child_added', (snapshot) => {
        dispatch({
          type: '@@reactReduxFirebase/SET',
          path: `${path}/${snapshot.key()}`,
          data: snapshot.val()
        });
      });
  }

  getData() {
    this.getFirebaseData('peaks');
    this.getFirebaseData('valleys');
  }

  setupHeatmap() {
    const { peaks, valleys } = this.props;

    if (__CLIENT__ && this._googleMapComponent) {
      const peaksData = Object.values(peaks).map(event => ({location: new google.maps.LatLng(event.lat, event.long), weight: event.rating}));
      const valleysData = Object.values(valleys).map(event => ({location: new google.maps.LatLng(event.lat, event.long), weight: event.rating}));

      if (peaksHeatmap) {
        peaksHeatmap.setData(peaksData);
      } else {
        peaksHeatmap = new google.maps.visualization.HeatmapLayer({
          data: peaksData,
          map: this._googleMapComponent.props.map,
          radius: 60
        });
      }

      if (valleysHeatmap) {
        valleysHeatmap.setData(valleysData);
      } else {
        valleysHeatmap = new google.maps.visualization.HeatmapLayer({
          data: valleysData,
          map: this._googleMapComponent.props.map,
          radius: 60,
          gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
          ]
        });
      }
    }
  }

  renderMap() {
    if (!this.props.peaks || !this.props.valleys) {
      return false;
    }

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
              ref={(map) => this._googleMapComponent = map}
              defaultZoom={12}
              defaultCenter={{lat: 37.7833, lng: -122.4167}} />
          }
        />
    </section>
    );
  }

  render() {
    const { show, selectedDate } = this.state;

    this.setupHeatmap();

    return (
      <Row>
        <Col xs={12} md={4}>
          <DatePicker
            className="text-center margin-sm-bottom"
            dateFormat="LL"
            selected={selectedDate}
            onChange={this.onDateChange.bind(this)} />
        </Col>
        <Col md={4}>
          <TimeSlider
            selectedDate={selectedDate}
            onChange={(momentTime) => this.setState({selectedDate: momentTime})} />
        </Col>
        <Col xs={12} md={4} className="text-right">
          <ButtonGroup>
            <Button active={show === 'feed'} onClick={() => this.setState({show: 'feed'})}>Feed</Button>
            <Button active={show === 'map'} onClick={() => this.setState({show: 'map'})}>Map</Button>
          </ButtonGroup>
        </Col>
        <Col xs={12} md={12}>
          {show === 'feed' ? this.renderFeed() : this.renderMap()}
        </Col>
      </Row>
    );
  }
}
