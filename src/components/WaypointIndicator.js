import React from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';

const WaypointIndicator = (props) => {
  const waypointType = props.waypointType;

  return (
    <View>
      <MapView.Circle
        radius={props.radius}
        center={props.center}
        strokeWidth={2}
        strokeColor={waypointType.color}
        fillColor={waypointType.fillColor}
      />
      <MapView.Marker
        coordinate={props.center}
        pinColor={waypointType.fillColor}
        title={props.title}
      />
    </View>
  );
};

WaypointIndicator.propTypes = {
  radius: PropTypes.number.isRequired,
  center: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  waypointType: PropTypes.any.isRequired,
};

export default WaypointIndicator;
