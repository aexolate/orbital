import React from 'react';
import { List } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const WaypointsList = (props) => {
  return (
    <List.Accordion title="Waypoints" left={(props) => <List.Icon {...props} icon="map-marker" />}>
      {props.waypoints.map((coords, index) => (
        <List.Item
          key={index}
          left={(props) => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => props.gotoWP(coords)}>
                <List.Icon {...props} icon="crosshairs-gps" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => props.deleteWP(coords)}>
                <List.Icon {...props} icon="map-marker-remove" />
              </TouchableOpacity>
            </View>
          )}
          title={'Waypoint ' + index}
        />
      ))}
    </List.Accordion>
  );
};
WaypointsList.propTypes = {
  waypoints: PropTypes.array.isRequired,
  gotoWP: PropTypes.func.isRequired,
  deleteWP: PropTypes.func.isRequired,
};
export default WaypointsList;
