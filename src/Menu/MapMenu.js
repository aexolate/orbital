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

const App = () => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [statusBG, requestPermissionBG] = Location.useBackgroundPermissions();
  const [curLocation, setCurLocation] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [destination, setDestination] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [previewLocation, setPreviewLocation] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [distanceToDest, setDistanceToDest] = useState(Infinity);
  const [isAlarmSet, setIsAlarmSet] = useState(false); //Indicates whether the alarm has been set
  const [reachedDestination, setReachedDestination] = useState(false); //Indicates whether the user has been in radius of destination
  let foregroundSubscription = null;
  const alarmManager = AlarmManager();
  const mapRef = useRef(null);

  //Distance to destination for alarm to activate
  const ACTIVATION_RADIUS = 500;

  TaskManager.defineTask('Geofencing', ({ data: { eventType, region }, error }) => {
    if (error) {
      console.log(error.message);
      return;
    }

    if (eventType === GeofencingEventType.Enter) {
      //console.log("You've entered region:", region);
      setReachedDestination(true);
      alarmManager.playAlarm();
      Location.stopGeofencingAsync('Geofencing');
    }
  });

  const startForegroundUpdate = async () => {
    foregroundSubscription?.remove();
    foregroundSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
      },
      (location) => {
        setCurLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      },
    );
  };

  //Initializing Function
  useEffect(() => {
    alarmManager.setupAudio();

    requestPermission().then((response) => {
      if (!response.granted) {
        console.log('Foreground permission not granted');
        return;
      }
      startForegroundUpdate();

      requestPermissionBG().then((response) => {
        console.log(response);
      });
    });
  }, []);

  //Effect when curLocation/destination is changed
  React.useEffect(() => {
    //Recalculate distance based on new locations
    let distanceRemaining = distanceBetween(curLocation, destination);
    setDistanceToDest(distanceRemaining);
  }, [curLocation, destination]);

  //selecting destination via longpress
  const selectLocLongPress = (mapEvent) => {
    if (isAlarmSet) return; //Do nothing on long press if alarm is already set

    const destination = {
      latitude: mapEvent.coordinate.latitude,
      longitude: mapEvent.coordinate.longitude,
    };
    setLocConfirmation(destination);
  };

  //function to get user to confirm is this is the destination they want to set as alarm
  const setLocConfirmation = (dest) => {
    setPreviewLocation(dest);
    setPromptVisible(true);
    const animateObj = { pitch: 0, heading: 0, zoom: 15 };
    mapRef.current.animateCamera({ center: dest, ...animateObj }, { duration: 1000 });
  };

  const unsetAlarm = () => {
    setIsAlarmSet(false);
    setReachedDestination(false);
    alarmManager.stopAlarm();
  };

  const [promptVisible, setPromptVisible] = React.useState(false);

  //Render
  return (
    <PaperProvider>
      <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialCamera={CONSTANTS.MAP_CAMERA.SINGAPORE}
          zoomControlEnabled={true}
          showsUserLocation={true}
          //mapPadding={{ top: StatusBar.currentHeight }} //Keeps map elements within view such as 'Locate' button
          onLongPress={(mapEvent) => {
            selectLocLongPress(mapEvent.nativeEvent);
          }}
        >
          {isAlarmSet && (
            <WaypointIndicator
              title="Destination"
              center={destination}
              radius={ACTIVATION_RADIUS}
            />
          )}

          {
            /* Preview Circle */
            promptVisible && (
              <MapView.Circle
                radius={ACTIVATION_RADIUS}
                center={previewLocation}
                strokeWidth={2}
                strokeColor={'#d0d61c'}
                fillColor={'rgba(208, 214, 28,0.3)'}
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
                Location.startGeofencingAsync('Geofencing', [
                  {
                    latitude: previewLocation.latitude,
                    longitude: previewLocation.longitude,
                    radius: 500,
                  },
                ]);
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

export default App;

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
