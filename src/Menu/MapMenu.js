import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { Platform, StyleSheet, View, StatusBar, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { GeofencingEventType } from 'expo-location';
import { distanceBetween } from '../utils/distance.js';
import { AlarmManager } from '../../AlarmManager.js';
import { Provider as PaperProvider, Button, Card, Text, Banner } from 'react-native-paper';
import CONSTANTS from '../constants/Constants.js';
import SnackbarHint from '../components/SnackbarHint.js';
import SearchbarLocation from '../components/SearchbarLocation.js';
import WaypointIndicator from '../components/WaypointIndicator.js';
import { WAYPOINT_TYPE } from '../constants/WaypointEnum.js';

const MapMenu = ({ route, navigation }) => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [statusBG, requestPermissionBG] = Location.useBackgroundPermissions();
  const [destination, setDestination] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [previewLocation, setPreviewLocation] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [distanceToDest, setDistanceToDest] = useState(Infinity);
  const [isAlarmSet, setIsAlarmSet] = useState(false); //Indicates whether the alarm has been set
  const [reachedDestination, setReachedDestination] = useState(false); //Indicates whether the user has been in radius of destination
  const [promptVisible, setPromptVisible] = React.useState(false);
  const alarmManager = AlarmManager();
  const mapRef = useRef(null);

  //Distance to destination for alarm to activate
  const ACTIVATION_RADIUS = //edit

  TaskManager.defineTask('Geofencing', ({ data: { eventType }, error }) => {
    if (error) {
      console.log(error.message);
      return;
    }

    if (eventType === GeofencingEventType.Enter) {
      setReachedDestination(true);
      alarmManager.playAlarm();
      Location.stopGeofencingAsync('Geofencing');
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
    const animateObj = { pitch: 0, heading: 0, zoom: 15 };
    mapRef.current.animateCamera({ center: dest, ...animateObj }, { duration: 500 });
  };

  const unsetAlarm = () => {
    setIsAlarmSet(false);
    setReachedDestination(false);
    alarmManager.stopAlarm();
  };

  const onUserLocationChange = (location) => {
    const coordinate = location.nativeEvent.coordinate;
    const curLocation = { latitude: coordinate.latitude, longitude: coordinate.longitude };
    setDistanceToDest(distanceBetween(curLocation, destination));
  };

  //Render
  return (
    <PaperProvider>
      {/* <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} /> */}
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialCamera={CONSTANTS.MAP_CAMERA.SINGAPORE}
          zoomControlEnabled={true}
          showsUserLocation={true}
          onUserLocationChange={onUserLocationChange}
          onLongPress={(mapEvent) => {
            selectLocLongPress(mapEvent.nativeEvent);
          }}
        >
          {isAlarmSet && (
            <WaypointIndicator
              title="Destination"
              center={destination}
              radius={ACTIVATION_RADIUS}
              waypointType={WAYPOINT_TYPE.DESTINATION}
            />
          )}

          {
            /* Preview Circle */
            promptVisible && (
              <WaypointIndicator
                title="Preview"
                center={previewLocation}
                radius={ACTIVATION_RADIUS}
                waypointType={WAYPOINT_TYPE.PREVIEW}
              />
            )
          }
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

        <SnackbarHint />

        {reachedDestination && (
          <Card>
            <Card.Title title="Destination Reached" />
            <Card.Content>
              <Button icon="alarm-off" mode="contained" onPress={unsetAlarm}>
                Dismiss Alarm
              </Button>
            </Card.Content>
          </Card>
        )}

        <Banner
          visible={promptVisible}
          actions={[
            {
              label: 'Set Destination',
              onPress: () => {
                setDestination(previewLocation);
                setIsAlarmSet(true);
                setPromptVisible(false);
                const region = {
                  latitude: previewLocation.latitude,
                  longitude: previewLocation.longitude,
                  radius: ACTIVATION_RADIUS,
                };
                Location.startGeofencingAsync('Geofencing', [region]);
              },
            },
            {
              label: 'Cancel',
              onPress: () => setPromptVisible(false),
            },
          ]}
        >
          Would you like to set this as your destination?
        </Banner>
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
});
