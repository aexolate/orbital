import React from 'react';
import { View, ScrollView } from 'react-native';
import { Portal, Button, Modal, List, Colors, IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';

const WaypointsModal = (props) => {
  return (
    <Portal>
      <Modal
        style={{ opacity: 0.92, padding: 25, margin: 0 }}
        visible={props.visible}
        contentContainerStyle={{ backgroundColor: 'white', padding: 20 }}
        onDismiss={props.onDismissModal}
      >
        <View style={{ maxHeight: 275 }}>
          <ScrollView persistentScrollbar>
            {props.waypoints.map((wp, index) => (
              <List.Item
                key={index}
                left={() => (
                  <View style={{ flexDirection: 'row' }}>
                    <IconButton
                      icon="crosshairs-gps"
                      color={Colors.blue300}
                      size={20}
                      onPress={() => props.onZoomWaypoint(wp)}
                    />

                    <IconButton
                      icon="map-marker-remove"
                      color={Colors.red400}
                      size={20}
                      onPress={() => {
                        if (props.waypoints.length == 1) {
                          //Close the modal if the WP was the last one in the list
                          props.onDismissModal();
                        }
                        props.onRemoveWaypoint(wp);
                      }}
                    />
                  </View>
                )}
                title={'Waypoint ' + index}
              />
            ))}
          </ScrollView>

          <Button mode="contained" onPress={props.onDismissModal} color={Colors.red600}>
            Close
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};
WaypointsModal.propTypes = {
  visible: PropTypes.bool,
  onDismissModal: PropTypes.func,
  waypoints: PropTypes.any,
  onZoomWaypoint: PropTypes.func.isRequired,
  onRemoveWaypoint: PropTypes.func,
};
export default WaypointsModal;
