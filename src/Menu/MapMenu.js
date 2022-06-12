import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { Platform, StyleSheet, View, StatusBar, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { GeofencingEventType } from 'expo-location';
import { distanceBetween } from '../utils/distance.js';
import { AlarmManager } from '../../AlarmManager.js';
import { WaypointsManager } from '../utils/WaypointsManager.js';
import { Provider as PaperProvider, Button, Card, Text, Banner, FAB } from 'react-native-paper';
import CONSTANTS from '../constants/Constants.js';
import SnackbarHint from '../components/SnackbarHint.js';
import SearchbarLocation from '../components/SearchbarLocation.js';
import WaypointIndicator from '../components/WaypointIndicator.js';
import AlarmBox from '../components/AlarmBox.js';
import { WAYPOINT_TYPE } from '../constants/WaypointEnum.js';
import PromptBox from '../components/PromptBox.js';

const MapMenu = () => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [statusBG, requestPermissionBG] = Location.useBackgroundPermissions();
  const [destination, setDestination] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [previewLocation, setPreviewLocation] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [distanceToDest, setDistanceToDest] = useState(Infinity);
  const [isAlarmSet, setIsAlarmSet] = useState(false); //Indicates whether the alarm has been set
  const [reachedDestination, setReachedDestination] = useState(false); //Indicates whether the user has been in radius of destination
  const [promptVisible, setPromptVisible] = React.useState(false);
  const alarmManager = AlarmManager();
  const waypointsManager = WaypointsManager();
  const mapRef = useRef(null);

  //Distance to destination for alarm to activate
  const ACTIVATION_RADIUS = 500;

  TaskManager.defineTask('GEOFENCING_TASK', ({ data: { region, eventType }, error }) => {
    if (error) {
      console.log(error.message);
      return;
    }

    if (eventType === GeofencingEventType.Enter) {
      //console.log(region);
      setReachedDestination(true);
      alarmManager.playAlarm();
      Location.stopGeofencingAsync('GEOFENCING_TASK');
    }
  });

  //Initializing Function
  useEffect(() => {
    alarmManager.setupAudio();
    askPerms();
  }, []);

  const askPerms = async () => {
    await requestPermission().then((response) => {
      if (!response.granted) {
        return;
      }
      requestPermissionBG().then(() => {
        checkPerms();
      });
    });
  };

  const checkPerms = async () => {
    return await Location.getBackgroundPermissionsAsync().then((perm) => perm.granted);
  };

  //selecting destination via longpress
  const selectLocLongPress = (mapEvent) => {
    if (isAlarmSet) return; //Do nothing on long press if alarm is already set

    const destination = {
      latitude: mapEvent.coordinate.latitude,
      longitude: mapEvent.coordinate.longitude,
    };
    setLocConfirmation(destination);
  };

  //function to get user to confirm is this the destination they want to set as alarm
  const setLocConfirmation = (dest) => {
    setPreviewLocation(dest);
    setPromptVisible(true);
    mapRef.current.animateCamera(
      { center: dest, pitch: 0, heading: 0, zoom: 15 },
      { duration: 500 },
    );
  };

  const unsetAlarm = () => {
    waypointsManager.clearWaypoints();
    setIsAlarmSet(false);
    setReachedDestination(false);
    alarmManager.stopAlarm();
  };

  const onUserLocationChange = (location) => {
    const coordinate = location.nativeEvent.coordinate;
    const curLocation = { latitude: coordinate.latitude, longitude: coordinate.longitude };
    setDistanceToDest(waypointsManager.distanceToNearestWP(curLocation));
  };

  const addDestination = (location) => {
    waypointsManager.addWaypoint({ ...location, radius: ACTIVATION_RADIUS });
    setDestination(location);
    setIsAlarmSet(true);
  };

  useEffect(() => {
    //If there are multiple waypoints set, start geofencing task
    if (waypointsManager.waypoints.length > 0) {
      Location.startGeofencingAsync('GEOFENCING_TASK', waypointsManager.waypoints);
    }
  }, [waypointsManager.waypoints]);

  //Render
  return (
    <PaperProvider>
      {/* <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} /> */}
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialCamera={CONSTANTS.MAP_CAMERA.SINGAPORE}
          zoomControlEnabled={true}
          showsUserLocation={true}
          onUserLocationChange={onUserLocationChange}
          onLongPress={(mapEvent) => selectLocLongPress(mapEvent.nativeEvent)}
        >
          {waypointsManager.waypoints.map((marker, index) => (
            <WaypointIndicator
              key={index}
              title="Destination"
              center={marker}
              radius={ACTIVATION_RADIUS}
              waypointType={WAYPOINT_TYPE.DESTINATION}
            />
          ))}

          {promptVisible && (
            <WaypointIndicator
              title="Preview"
              center={previewLocation}
              radius={ACTIVATION_RADIUS}
              waypointType={WAYPOINT_TYPE.PREVIEW}
            />
          )}
        </MapView>

        {isAlarmSet && !reachedDestination && (
          <Card style={styles.infoBox}>
            <Card.Content>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {'Distance to Destination: ' + (distanceToDest / 1000).toFixed(2) + ' km'}
              </Text>
              <Button icon="cancel" mode="contained" onPress={unsetAlarm}>
                Cancel Alarm
              </Button>
            </Card.Content>
          </Card>
        )}

        {!isAlarmSet && (
          <View style={styles.searchBar}>
            <SearchbarLocation onResultReady={(loc) => setLocConfirmation(loc)} />
          </View>
        )}
        {/* <FAB
          style={styles.fab}
          label="Add more waypoints"
          icon="plus"
          onPress={() => console.log('Pressed')}
        /> */}

        <SnackbarHint />

        {reachedDestination && <AlarmBox onDismissAlarm={unsetAlarm} />}

        <PromptBox
          visible={promptVisible}
          onConfirmPrompt={() => {
            addDestination(previewLocation);
            setPromptVisible(false);
          }}
          onCancelPrompt={() => setPromptVisible(false)}
        />
      </View>
    </PaperProvider>
  );
};
export default MapMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  input: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchBar: {
    position: 'absolute',
    width: '80%',
    opacity: 0.95,
    top: '15%',
    alignSelf: 'center',
  },
  infoBox: {
    position: 'absolute',
    alignItems: 'center',
    opacity: 0.9,
    width: '90%',
    bottom: '15%',
    alignSelf: 'center',
    elevation: 4,
  },
  alarmBox: {
    position: 'absolute',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '40%',
    alignSelf: 'center',
    top: '30%',
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    margin: 0,
    left: 20,
    bottom: 30,
  },
});
