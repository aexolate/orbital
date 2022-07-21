import React, { useState } from 'react';
import { Alert, View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useNavigation } from '@react-navigation/native';
import { distanceBetween } from './src/utils';

const LOCATION_TRACKING = 'location-tracking';
const TIME_INTERVAL = 10000; //in milliseconds

export const FailSafe = () => {
  const [permissionsIsGranted, setPermissionIsGranted] = useState(false);
  const [timeTravelled, setTimeTravelled] = useState(1);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [isLocationLost, setIsLocationLost] = useState(false);
  const [distanceRemaining, setDistanceRemaining] = useState(0);
  const navigation = useNavigation();

  //background task that tracks user's travel distance & speed and activates failsafe if location lost
  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (data) {
      const { locations } = data;

      //set boolean for if location is lost (change depending on return type if no signal)
      if (locations == undefined) {
        setIsLocationLost(true);
      } else {
        setIsLocationLost(false);
      }

      //record down time & distance travelled if location not lost
      if (!isLocationLost) {
        setTimeTravelled((time) => time + TIME_INTERVAL);

        if (previousLocation == null) {
          setPreviousLocation(locations[0]);
        } else {
          setDistanceTravelled((distance) => {
            let newDistance = distanceBetween(locations[0].coords, previousLocation.coords);
            distance = distance + newDistance;
          });
          setPreviousLocation(locations[0]);
        }
      }

      console.log(locations[0]);

      //activate failsafe if location is lost
      if (isLocationLost) {
        let speed = Math.max(distanceTravelled / timeTravelled);
        let approxTime = Math.min(speed / distanceRemaining);
        failSafeAlarm(approxTime);
      }
    }
  });

  //failsafe
  const failSafeAlarm = (timeLeft) => {
    setTimeout(() => {
      if (isLocationLost) {
        //sound alarm
        Alert.alert('ALARM SOUNDED!');
      }
    }, timeLeft);
  };

  //set distance remaining
  const storeDistanceRemain = (value) => {
    setDistanceRemaining(value);
  };

  //check for tracking permissions
  const checkRequestLocationPerms = async () => {
    const fgPermissions = await Location.requestForegroundPermissionsAsync();
    const bgPermissions = await Location.requestBackgroundPermissionsAsync();
    if (fgPermissions.granted && bgPermissions.granted) {
      setPermissionIsGranted(true);
    } else {
      setPermissionIsGranted(false);
      Alert.alert(
        'Permission not granted',
        'Please enable both foreground and background tracking!',
      );
      navigation.navigate('Permissions');
    }
  };

  //start taking note of user's travelling distance and speed
  const startTrackPosition = async () => {
    //console.log('START TRACK POSITION');
    const hasStartedLocUpdate = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
    //console.log('locUp?: ', hasStartedLocUpdate);
    if (permissionsIsGranted && !hasStartedLocUpdate) {
      await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: TIME_INTERVAL,
        distanceInterval: 0,
      });
    }
  };

  //stop taking note of user's travelling distance and speed
  const stopTrackPosition = () => {
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        clearValues();
      }
    });
  };

  //clear distance travelled, time taken & previous location
  const clearValues = () => {
    setDistanceTravelled(0);
    setTimeTravelled(1);
    setPreviousLocation(null);
  };

  return {
    checkRequestLocationPerms,
    startTrackPosition,
    stopTrackPosition,
    clearValues,
    storeDistanceRemain,
  };
};

export default FailSafe;
