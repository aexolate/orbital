import React from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';

const WaypointIndicator = (props) => {
  // const colorEnum = {
  //   Destination: { color: '#fe5f55', fillColor: 'rgba(254,95,85,0.3)' },
  //   Preview: { color: '#d0d61c', fillColor: 'rgba(208, 214, 28,0.3)' },
  // };
  // const waypointType = props.waypointType;

  return (
    <View>
      <MapView.Circle
        radius={props.radius}
        center={props.center}
        strokeWidth={2}
        strokeColor={'#fe5f55'}
        fillColor={'rgba(254,95,85,0.3)'}
      />
      <MapView.Marker coordinate={props.center} pinColor="#fe5f55" title={props.title} />
    </View>
  );
};

WaypointIndicator.propTypes = {
  radius: PropTypes.number.isRequired,
  center: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
};

export default WaypointIndicator;
