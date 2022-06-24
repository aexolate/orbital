import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { StyleSheet, View, StatusBar, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { GeofencingEventType } from 'expo-location';
import { AlarmManager } from '../../AlarmManager.js';
import { WaypointsManager } from '../utils/WaypointsManager.js';
import { Provider as PaperProvider, Text, Button, TextInput } from 'react-native-paper';
import CONSTANTS from '../constants/Constants.js';
import SearchbarLocation from '../components/SearchbarLocation.js';
import WaypointIndicator from '../components/WaypointIndicator.js';
import AlarmBox from '../components/AlarmBox.js';
import PromptBox from '../components/PromptBox.js';
import InfoBox from '../components/InfoBox.js';
import FavouritesDialog from '../components/FavouritesDialog.js';
import WaypointsList from '../components/WaypointsList.js';
import { WAYPOINT_TYPE } from '../constants/WaypointEnum.js';
import { DatabaseManager } from '../utils/DatabaseManager';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import Dimensions from 'react-native';
import { getData } from '../utils/AsyncStorage.js';
import { Value } from 'react-native-reanimated';
import { MenuButton } from '../components';

const MapMenu = ({ route, navigation }) => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [statusBG, requestPermissionBG] = Location.useBackgroundPermissions();

  const [promptVisible, setPromptVisible] = useState(false);
  const [favDialogVisible, setFavDialogVisible] = useState(false);
  const [previewLocation, setPreviewLocation] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [distanceToDest, setDistanceToDest] = useState(Infinity);
  //const [canModifyAlarm, setCanModifyAlarm] = useState(true); //Indicates whether new waypoints can be added
  const [reachedDestination, setReachedDestination] = useState(false); //Indicates whether the user has been in radius of destination
  const alarmManager = AlarmManager();
  const waypointsManager = WaypointsManager();
  const dbManager = DatabaseManager();
  const mapRef = useRef(null);
  const [settingRadius, setSettingRadius] = useState(500); //internal default radius value from settings, retrieve during select location
  const [wpRadius, setWpRadius] = useState(500); //waypoint radius value that can be changed from MapMenu

  //Define geofencing task for expo-location. Must be defined in top level scope
  TaskManager.defineTask('GEOFENCING_TASK', ({ data: { region, eventType }, error }) => {
    if (eventType === GeofencingEventType.Enter) {
      //Removes the waypoint that the user just entered
      waypointsManager.removeWaypoint(region);

      //Indicates the user has reached destination and displays AlarmBox and plays the alarm
      setReachedDestination(true);
    }
  });

  //Initializing Function
  useEffect(() => {
    alarmManager.setupAudio();
    checkRequestLocationPerms();

    //Set default radius to be from settings
    getData('radius').then((val) => setWpRadius(parseInt(val)));
  }, []);

  useEffect(() => {
    route.params?.requests.map((r) => addDestination(r.coords));
  }, [route.params?.requests]);

  useEffect(() => {
    if (reachedDestination) {
      alarmManager.playAlarm();
    } else {
      alarmManager.stopAlarm();
    }
  }, [reachedDestination]);

  const checkRequestLocationPerms = () => {
    requestPermission()
      .then((response) => {
        if (response.granted) {
          requestPermissionBG();
        }
      })
      .then(() => {
        Location.getBackgroundPermissionsAsync().then((perm) => {
          if (!perm.granted) {
            //Navigate user to permissions if BG location not granted
            navigation.navigate('Permissions');
          }
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
    getData('radius').then((value) => {
      setPreviewLocation(dest);
      setPromptVisible(true);
      mapRef.current.animateCamera({ center: dest, zoom: 15, duration: 500 });
    });
  };

  //Removes the alarm set and removes all waypoints
  const unsetAlarm = () => {
    waypointsManager.clearWaypoints();
  };

  //Dismiss the ringing alarm
  const dismissAlarm = () => setReachedDestination(false);

  const onUserLocationChange = (location) => {
    const curLatLng = location.nativeEvent.coordinate;
    setDistanceToDest(waypointsManager.distanceToNearestWP(curLatLng));
  };

  const addDestination = (location) => {
    waypointsManager.addWaypoint({
      ...location,
      radius: wpRadius,
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

  //Render
  return (
    <PaperProvider>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialCamera={CONSTANTS.MAP_CAMERA.SINGAPORE}
          zoomControlEnabled={true}
          showsUserLocation={true}
          mapPadding={{ top: 35 }}
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

        {waypointsManager.waypoints.length > 0 && !reachedDestination && (
          <View>
            <InfoBox
              distance={distanceToDest}
              onCancelAlarm={unsetAlarm}
              onSaveAlarm={() => setFavDialogVisible(true)}
            />
            <WaypointsList
              waypoints={waypointsManager.waypoints}
              gotoWP={(coords) => {
                mapRef.current.animateCamera({ center: coords, zoom: 15, duration: 500 });
              }}
              deleteWP={(coords) => waypointsManager.removeWaypoint(coords)}
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
          <TextInput
            dense
            style={styles.radiusTextInput}
            mode="outlined"
            label="Activation Radius"
            value={`${wpRadius}`}
            onChangeText={(txt) => setWpRadius(parseInt(txt))}
            right={<TextInput.Affix text="meters" />}
            keyboardType="numeric"
          />
        </View>

        {reachedDestination && <AlarmBox onDismissAlarm={dismissAlarm} />}

        <PromptBox
          visible={promptVisible}
          onConfirmPrompt={() => {
            addDestination(previewLocation);
            setPromptVisible(false);
          }}
          onCancelPrompt={() => setPromptVisible(false)}
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
    paddingTop: 100,
    alignSelf: 'center',
  },
  infoBox: {
    position: 'absolute',
    alignItems: 'center',
    opacity: 0.9,
    bottom: 0,
    paddingBottom: 90,
    paddingLeft: 10,
  },
  menuButton: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 10,
  },
  radiusTextInput: {
    width: 155,
  },
});
