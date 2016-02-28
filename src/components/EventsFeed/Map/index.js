import React, { Component, PropTypes } from 'react';
import { GoogleMapLoader, GoogleMap, OverlayView } from 'react-google-maps';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const styles = require('../style.scss');

export default class Map extends Component {
  static propTypes = {
    data: PropTypes.object,
    onMapLoad: PropTypes.func,
    showEvents: PropTypes.bool
  }

  shouldComponentUpdate(nextProps) {
    return this.props.data !== nextProps.data || this.props.showEvents !== nextProps.showEvents;
  }

  render() {
    const { data, onMapLoad, showEvents } = this.props;

    const overlays = Object.values(data).map((event, index) => {
      const popover = (
        <Popover id={`${event.id}-event-${index}`} title={`${event.time}`}>
          {event.name}
        </Popover>
      );

      return (
        <OverlayView
          position={{lat: event.lat, lng: event.long}}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          key={`${event.id}-${index}`}>
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
              ref={(map) => onMapLoad(map)}
              defaultZoom={12}
              defaultCenter={{lat: 37.7833, lng: -122.4167}} >
              {showEvents && overlays}
            </GoogleMap>
          }
        />
      </section>
    );
  }
}
