import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Alert, Text, Image } from 'react-native';
import { Provider as PaperProvider, Button, Colors, Portal, Modal } from 'react-native-paper';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { AlarmManager } from '../../AlarmManager.js';
import CONSTANTS from '../constants/Constants.js';
import { WAYPOINT_TYPE } from '../constants/WaypointEnum.js';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import {
  AlarmBox,
  WaypointIndicator,
  FavouritesDialog,
  SearchbarLocation,
  PromptBox,
  InfoBox,
  WaypointsModal,
} from '../components';
import { DatabaseManager, WaypointsManager } from '../utils';
import { LocationRegion } from 'expo-location';
import { useIsFocused } from '@react-navigation/native';
import { getData, storeData } from '../utils/AsyncStorage';

const MapMenu = ({ route, navigation }) => {
  const [promptVisible, setPromptVisible] = useState(false);
  const [favDialogVisible, setFavDialogVisible] = useState(false);
  const [previewLocation, setPreviewLocation] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [distanceToDest, setDistanceToDest] = useState(Infinity);
  const [reachedDestination, setReachedDestination] = useState(false); //Indicates whether the user has been in radius of destination
  const [showGuide, setShowGuide] = useState(true);

  const alarmManager = AlarmManager();
  const waypointsManager = WaypointsManager();
  const dbManager = DatabaseManager();
  const isFocused = useIsFocused();

  const mapRef = useRef(null);
  const [wpRadius, setWpRadius] = useState(500); //waypoint radius value that can be changed from MapMenu
  const [WPListVisible, setWPListVisible] = useState(false);

  type GeofencingTask = {
    eventType: Location.GeofencingEventType;
    region: LocationRegion;
  };

  //Define geofencing task for expo-location
  TaskManager.defineTask(
    'GEOFENCING_TASK',
    ({ data: { region, eventType }, error }: TaskManager.TaskManagerTaskBody<GeofencingTask>) => {
      if (error) {
        Alert.alert('TASK ERROR', error.message); //This error should not happen
        return;
      }

      if (eventType === Location.GeofencingEventType.Enter) {
        //Removes the waypoint that the user just entered
        waypointsManager.removeWaypoint(region);

        //Indicates the user has reached destination and displays AlarmBox and plays the alarm
        setReachedDestination(true);
      }
    },
  );

  //Initializing Function
  useEffect(() => {
    getData('HAS_LAUNCHED').then((res) => {
      if(res == 'TRUE') {
        setShowGuide(false);
      }
    });

    alarmManager.setupAudio();
    checkRequestLocationPerms();
  }, []);

  useEffect(() => {
    route.params?.requests.map((wp) => addDestination(wp.coords, wp.title));
  }, [route.params?.requests]);

  useEffect(() => {
    if (reachedDestination) {
      alarmManager.playAlarm();
    } else {
      alarmManager.stopAlarm();
    }
  }, [reachedDestination]);

  useEffect(() => {
    if (isFocused) {
      alarmManager.loadAudio();
    }
  }, [isFocused]);

  const checkRequestLocationPerms = () => {
    //The background permission must be only requested AFTER foreground permission
    Location.requestForegroundPermissionsAsync().then(() => {
      Location.requestBackgroundPermissionsAsync().then(() => {
        //Check if user granted both permission after requesting
        Location.getBackgroundPermissionsAsync().then((perm) => {
          if (!perm.granted) {
            //Navigate user to permissions if BG location not granted
            navigation.navigate('Permissions');
          }
        });
      });
    });
  };

  //selecting destination via longpress
  const selectLocLongPress = (mapEvent) => {
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
    mapRef.current.animateCamera({ center: dest, zoom: 15, duration: 500 });
  };

  //Removes the alarm set and removes all waypoints
  const unsetAlarm = () => {
    Alert.alert('Confirm', 'Are you sure you want to clear this alarm?', [
      { text: 'Yes', onPress: () => waypointsManager.clearWaypoints() },
      { text: 'No' },
    ]);
  };

  //Dismiss the ringing alarm
  const dismissAlarm = () => setReachedDestination(false);

  const onUserLocationChange = (location) => {
    const curLatLng = location.nativeEvent.coordinate;
    setDistanceToDest(waypointsManager.distanceToNearestWP(curLatLng));
  };

  const addDestination = (location, name) => {
    if (wpRadius <= 0) {
      Alert.alert('Error', 'Radius must be greater than 0 meters');
      return;
    }

    waypointsManager.addWaypoint({
      ...location,
      radius: wpRadius,
      title: name === undefined ? 'untitled' : name,
    });
  };

  useEffect(() => {
    //Updates the distance when waypoints are modified
    if (waypointsManager.waypoints.length > 0) {
      Location.getLastKnownPositionAsync().then((locationObj) => {
        setDistanceToDest(waypointsManager.distanceToNearestWP(locationObj.coords));
      });
    }

    //Handles geofencing when the waypoints are modified
    Location.hasStartedGeofencingAsync('GEOFENCING_TASK')
      .then((started) => {
        //Stops old geofencing to start the geofencing again with the updated waypoints
        if (started) Location.stopGeofencingAsync('GEOFENCING_TASK');
      })
      .then(() => {
        //If there are multiple waypoints set, start geofencing task
        if (waypointsManager.waypoints.length > 0) {
          Location.startGeofencingAsync('GEOFENCING_TASK', waypointsManager.waypoints);
        }
      });
  }, [waypointsManager.waypoints]);

  const addAlarmToFavourites = (title) => {
    dbManager.insertAlarm(title == '' ? 'Untitled' : title, waypointsManager.waypoints);
    Alert.alert('Favourites', 'Current alarm has been added to favourites');
  };

  const zoomToLocation = (coords) => {
    mapRef.current.animateCamera({
      center: coords,
      zoom: 15,
      duration: 500,
    });
  };

  const dismissGuide = () => {
    setShowGuide(false);
    storeData('HAS_LAUNCHED', 'TRUE');
  };

  //Render
  return (
    <PaperProvider>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialCamera={CONSTANTS.MAP_CAMERA.SINGAPORE}
          zoomControlEnabled={true}
          showsUserLocation={true}
          mapPadding={{ top: Constants.statusBarHeight, bottom: 0, right: 0, left: 0 }}
          onUserLocationChange={onUserLocationChange}
          onLongPress={(mapEvent) => selectLocLongPress(mapEvent.nativeEvent)}
        >
          {waypointsManager.waypoints.map((marker, index) => (
            <WaypointIndicator
              key={index}
              title="Destination"
              center={marker}
              radius={marker.radius}
              waypointType={WAYPOINT_TYPE.DESTINATION}
            />
          ))}

          {promptVisible && (
            <WaypointIndicator
              title="Preview"
              center={previewLocation}
              radius={wpRadius}
              waypointType={WAYPOINT_TYPE.PREVIEW}
            />
          )}
        </MapView>

        <View>
          <PromptBox
            visible={promptVisible}
            onConfirmPrompt={() => {
              addDestination(previewLocation, 'untitled');
              setPromptVisible(false);
            }}
            onRadiusChange={(rad) => setWpRadius(rad)}
            onCancelPrompt={() => setPromptVisible(false)}
          />
        </View>

        {waypointsManager.getWaypointCount() > 0 && !reachedDestination && !promptVisible && (
          <View style={styles.infoBox}>
            <InfoBox
              distance={distanceToDest}
              onCancelAlarm={unsetAlarm}
              onSaveAlarm={() => setFavDialogVisible(true)}
            />
          </View>
        )}

        <FavouritesDialog
          visible={favDialogVisible}
          onConfirm={(title) => {
            addAlarmToFavourites(title);
            setFavDialogVisible(false);
          }}
          onDismiss={() => setFavDialogVisible(false)}
        />

        <View style={styles.searchBar}>
          <SearchbarLocation onResultReady={(loc) => setLocConfirmation(loc)} />
        </View>

        {reachedDestination && <AlarmBox onDismissAlarm={dismissAlarm} />}

        <WaypointsModal
          visible={WPListVisible}
          onDismissModal={() => setWPListVisible(false)}
          onZoomWaypoint={(coords) => zoomToLocation(coords)}
          onRemoveWaypoint={(coords) => waypointsManager.removeWaypoint(coords)}
          waypoints={waypointsManager.waypoints}
        />

        <Button
          icon="menu"
          color="white"
          mode="contained"
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          Menu
        </Button>

        <Button
          icon="map-marker-path"
          color={Colors.blue800}
          mode="contained"
          disabled={waypointsManager.getWaypointCount() <= 0}
          onPress={() => setWPListVisible(true)}
          style={styles.waypointsButton}
        >
          Waypoints
        </Button>

        <Portal>
          <Modal visible={showGuide} onDismiss={dismissGuide} contentContainerStyle={{ backgroundColor: 'white', padding: 10 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Quick Start Guide</Text>
              <Image
                source={require('../../assets/quickstart.png')}
                style={{ width: '100%', height: undefined, aspectRatio: 1 }}
              />
              <Text>
                Begin setting an alarm by long-pressing a location on the map, or using the
                searchbar to use that location.
              </Text>

              <Button onPress={dismissGuide}>Dismiss</Button>
            </View>
          </Modal>
        </Portal>

      </View>
    </PaperProvider>
  );
};
MapMenu.propTypes = {
  route: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};
export default MapMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    width: '80%',
    opacity: 0.98,
    paddingTop: Constants.statusBarHeight + 60,
    alignSelf: 'center',
  },
  infoBox: {
    position: 'absolute',
    width: '80%',
    opacity: 0.95,
    //top: Constants.statusBarHeight + 140,
    bottom: '15%',
    alignSelf: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: Constants.statusBarHeight + 10,
    left: 10,
  },
  waypointsButton: {
    position: 'absolute',
    top: Constants.statusBarHeight + 10,
    right: 60,
  },
  actionsBar: {
    position: 'absolute',
    top: Constants.statusBarHeight + 140,
    left: '10%',
    //width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  radiusTextInput: {
    width: 155,
  },
});
