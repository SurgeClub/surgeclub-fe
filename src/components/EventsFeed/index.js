import React, { Component, PropTypes } from 'react';
import { Row, Col, Input } from 'react-bootstrap';

import { connect } from 'react-redux';

import moment from 'moment';
import { firebase as firebaseConnect } from 'redux-react-firebase';

// components
import TimeSlider from './TimeSlider';
import Map from './Map';
import DatePicker from './DatePicker';

import { setBatch } from 'redux/modules/firebase';

let peaksHeatmap;
let valleysHeatmap;

@firebaseConnect()
@connect(
  (state) => {
    return {
      peaks: state.firebase.peaks,
      valleys: state.firebase.valleys
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
    showEvents: true,
    selectedDate: moment()
  }

  componentWillMount() {
    this.getData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props.peaks !== nextProps.peaks,
    this.props.valleys !== nextProps.valleys,
    !this.state.selectedDate.isSame(nextState.selectedDate));
    return (
      this.props.peaks !== nextProps.peaks ||
      this.props.valleys !== nextProps.valleys ||
      this.state.showEvents !== nextState.showEvents ||
      !this.state.selectedDate.isSame(nextState.selectedDate)
    );
  }

  onDateChange(date) {
    this.setState({selectedDate: date}, () => {
      this.getData();
    });
  }

  getFirebaseData(path) {
    const { dispatch, firebase } = this.props;
    const { selectedDate } = this.state;
    // This is bad. Don't do this please.
    firebase.ref
      .child(path)
      .orderByChild('time')
      .startAt(selectedDate.format('YYYY-MM-DD HH:mm'))
      .endAt(selectedDate.clone().endOf('day').format('YYYY-MM-DD HH:mm'))
      .on('value', (snapshot) => {
        if (snapshot.val()) {
          dispatch(setBatch(snapshot.val(), path));
        }
      });
  }

  getData() {
    this.getFirebaseData('peaks');
    this.getFirebaseData('valleys');
  }

  getWeightedData(data) {
    const { selectedDate } = this.state;

    return Object.values(data).reduce((array, event) => {
      if (moment(event.time).isBefore(selectedDate.clone().add(30, 'minutes')) && moment(event.time).isAfter(selectedDate.clone())) {
        return array.concat({location: new google.maps.LatLng(event.lat, event.long), weight: event.rating});
      }

      return array;
    }, []);
  }

  setupHeatmap() {
    const { peaks, valleys } = this.props;

    if (__CLIENT__ && this._googleMapComponent) {
      const peaksData = this.getWeightedData(peaks);
      const valleysData = this.getWeightedData(valleys);
      console.log(peaksData.length, valleysData.length);

      if (valleysHeatmap) {
        valleysHeatmap.setData(valleysData);
      } else {
        valleysHeatmap = new google.maps.visualization.HeatmapLayer({
          data: valleysData,
          map: this._googleMapComponent.props.map,
          radius: 30,
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
            'rgba(63, 0, 91, 1)'
          ]
        });
      }

      if (peaksHeatmap) {
        peaksHeatmap.setData(peaksData);
      } else {
        peaksHeatmap = new google.maps.visualization.HeatmapLayer({
          data: peaksData,
          map: this._googleMapComponent.props.map,
          radius: 60
        });
      }
    }
  }

  renderMap() {
    const { peaks, valleys } = this.props;
    const { showEvents, selectedDate } = this.state;

    if (!peaks || !valleys) {
      return <p>Loading</p>;
    }

    const merged = Object.assign(peaks, valleys);
    const data = {};
    Object.keys(merged).forEach(eventId => {
      const event = merged[eventId];

      if (moment(event.time).isAfter(selectedDate.clone().startOf('day')) && moment(event.time).isBefore(selectedDate.clone().endOf('day'))) {
        data[eventId] = event;
      }
    });
    // should not accomuldate but instead filter by selected date
    return (
      <Map
        data={data}
        onMapLoad={(map) => this._googleMapComponent = map}
        showEvents={showEvents} />
    );
  }

  render() {
    const { selectedDate } = this.state;

    this.setupHeatmap();

    return (
      <Row>
        <Col xs={12} md={4}>
          <DatePicker
            selectedDate={selectedDate}
            onChange={this.onDateChange.bind(this)} />
        </Col>
        <Col md={4}>
          <TimeSlider
            selectedDate={selectedDate}
            onChange={(momentTime) => this.setState({selectedDate: momentTime})} />
        </Col>
        <Col xs={12} md={4} className="text-right">
          <Input type="checkbox" label="Show events" checked={this.state.showEvents} onChange={(event) => this.setState({showEvents: event.target.checked})} />
        </Col>
        <Col xs={12} md={12}>
          {this.renderMap()}
        </Col>
      </Row>
    );
  }
}
