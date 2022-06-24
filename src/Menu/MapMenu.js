import React, { useEffect, useState, ReactElement, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { GeofencingEventType } from 'expo-location';
import { AlarmManager } from '../../AlarmManager.js';
import { WaypointsManager } from '../utils/WaypointsManager.js';
import {
  Provider as PaperProvider,
  FAB,
  List,
  HelperText,
  Text,
  Button,
  TextInput,
} from 'react-native-paper';
import CONSTANTS from '../constants/Constants.js';
import SnackbarHint from '../components/SnackbarHint.js';
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

const MapMenu = ({ route, navigation }) => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [statusBG, requestPermissionBG] = Location.useBackgroundPermissions();

  const [promptVisible, setPromptVisible] = React.useState(false);
  const [favDialogVisible, setFavDialogVisible] = React.useState(false);
  const [previewLocation, setPreviewLocation] = useState(CONSTANTS.LOCATIONS.DEFAULT);
  const [distanceToDest, setDistanceToDest] = useState(Infinity);
  //const [canModifyAlarm, setCanModifyAlarm] = useState(true); //Indicates whether new waypoints can be added
  const [reachedDestination, setReachedDestination] = useState(false); //Indicates whether the user has been in radius of destination
  const alarmManager = AlarmManager();
  const waypointsManager = WaypointsManager();
  const dbManager = DatabaseManager();
  const mapRef = useRef(null);
  const [settingRadius, setSettingRadius] = useState(0); //internal default radius value from settings, retrieve during select location
  const [wpRadius, setWpRadius] = useState(''); //waypoint radius value that can be changed from MapMenu

  //Define geofencing task for expo-location. Must be defined in top level scope
  TaskManager.defineTask('GEOFENCING_TASK', ({ data: { region, eventType }, error }) => {
    if (eventType === GeofencingEventType.Enter) {
      //Removes the waypoint that the user just entered
      waypointsManager.removeWaypoint(region);

      //Indicates the user has reached destination and displays AlarmBox and plays the alarm
      setReachedDestination(true);
      alarmManager.playAlarm();
    }
  });

  React.useEffect(() => {
    if (route.params?.requests) {
      route.params.requests.map((r) => {
        addDestination(r.coords);
      });
    }
  }, [route.params?.requests]);

  //Initializing Function
  useEffect(() => {
    alarmManager.setupAudio();
    checkRequestLocationPerms();
  }, []);

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
    //if (!canModifyAlarm) return; //Do nothing if not allowed to set new waypoints

    const destination = {
      latitude: mapEvent.coordinate.latitude,
      longitude: mapEvent.coordinate.longitude,
    };
    setLocConfirmation(destination);
  };

  //function to get user to confirm is this the destination they want to set as alarm
  const setLocConfirmation = (dest) => {
    getData('radius').then((value) => setSettingRadius(parseFloat(value))); //update the radius value from setting
    console.log(settingRadius);
    setPreviewLocation(dest);
    setPromptVisible(true);
    mapRef.current.animateCamera({ center: dest, zoom: 15, duration: 500 });
  };

  //Removes the alarm set and removes all waypoints
  const unsetAlarm = () => {
    waypointsManager.clearWaypoints();
    //setCanModifyAlarm(true);
    setWpRadius(''); //to reset value for next waypoint
    // setReachedDestination(false);
    // alarmManager.stopAlarm();
  };

  //Dismiss the ringing alarm
  const dismissAlarm = () => {
    if (waypointsManager.waypoints.length == 0) {
      //setCanModifyAlarm(true);
    }
    setReachedDestination(false);
    alarmManager.stopAlarm();
  };

  const onUserLocationChange = (location) => {
    setDistanceToDest(waypointsManager.distanceToNearestWP(location.nativeEvent.coordinate));
  };

  const addDestination = (location) => {
    //waypointsManager.addWaypoint({ ...location, radius: ACTIVATION_RADIUS });
    //setCanModifyAlarm(false);
    waypointsManager.addWaypoint({
      ...location,
      radius: wpRadius == '' ? settingRadius : parseInt(wpRadius),
    });
    setWpRadius(''); //reset wpRadius after adding
  };

  useEffect(() => {
    //Updates the distance when waypoints are modified
    if (waypointsManager.waypoints.length > 0) {
      Location.getLastKnownPositionAsync().then((locationObj) => {
        setDistanceToDest(waypointsManager.distanceToNearestWP(locationObj.coords));
      });
    }

    //Allow new waypoints to be added if there are no waypoints set
    if (waypointsManager.waypoints.length == 0) {
      //setCanModifyAlarm(true);
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
      {/* <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} /> */}
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
              radius={wpRadius == '' ? settingRadius : parseInt(wpRadius)}
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

        <View style={{ position: 'absolute', top: 90, left: 10 }}>
          <TextInput
            style={styles.wpTextInput}
            mode="outlined"
            label="Activation Radius"
            value={wpRadius}
            onChangeText={setWpRadius}
            right={<TextInput.Affix text="meters" />}
            keyboardType="numeric"
          />
        </View>

        {/* {!canModifyAlarm && waypointsManager.waypoints.length > 0 && !reachedDestination && (
        {canModifyAlarm && (
        )}

        {!canModifyAlarm && waypointsManager.waypoints.length > 0 && !reachedDestination && (
          <FAB
            style={styles.fab}
            label="ADD WAYPOINT"
            icon="map-marker-plus"
            theme={{ colors: { accent: 'teal' } }}
            onPress={() => setCanModifyAlarm(true)}
          />
        )}

        {waypointsManager.waypoints.length > 0 && (
          <FAB
            style={styles.fabFav}
            label="FAVOURITE"
            icon="star"
            theme={{ colors: { accent: 'yellow' } }}
            onPress={() => setFavDialogVisible(true)}
          />
        )} */}

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
          <HelperText style={{ backgroundColor: 'white' }}>
            or long-press the map to select location
          </HelperText>
        </View>

        {/* <SnackbarHint /> */}

        {reachedDestination && <AlarmBox onDismissAlarm={dismissAlarm} />}

        <PromptBox
          visible={promptVisible}
          onConfirmPrompt={() => {
            addDestination(previewLocation);
            setPromptVisible(false);
            setWpRadius(settingRadius); //to reset value for next waypoint
          }}
          onCancelPrompt={() => setPromptVisible(false)}
        />

        <Button
          icon="menu"
          color="white"
          mode="contained"
          onPress={() => {
            navigation.openDrawer();
          }}
          style={{ position: 'absolute', top: Constants.statusBarHeight, left: 10 }}
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
    width: '85%',
    opacity: 0.98,
    //paddingLeft: 10,
    paddingTop: 100,
    alignSelf: 'center',
  },
  infoBox: {
    position: 'absolute',
    alignItems: 'center',
    opacity: 0.9,
    // bottom: 80,
    // left: 10,
    bottom: 0,
    paddingBottom: 90,
    paddingLeft: 10,
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
    left: 10,
    top: 10,
  },
  fabFav: {
    position: 'absolute',
    margin: 0,
    left: 190,
    top: 10,
  },
  wpTextInput: {
    height: 50,
    width: 170,
    top: 100,
  },
});
