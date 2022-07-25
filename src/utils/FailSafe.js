import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useNavigation } from '@react-navigation/native';
import { distanceBetween } from '../utils/distance';
import { AlarmManager } from '../../AlarmManager';
import * as Battery from 'expo-battery';
import { getData } from './AsyncStorage';

const LOCATION_TRACKING = 'location-tracking';
const TIME_INTERVAL = 10000; //in milliseconds

export const FailSafe = () => {
  const [permissionsIsGranted, setPermissionIsGranted] = useState(false);
  const [timeTravelled, setTimeTravelled] = useState(1);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [isLocationLost, setIsLocationLost] = useState(false);
  const [distanceRemaining, setDistanceRemaining] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [failsafeEnabled, setFailsafeEnabled] = useState(false);
  const navigation = useNavigation();
  const alarmManager = AlarmManager();

  useEffect(() => {
    alarmManager.setupAudio();
  }, []);

  //background task that tracks user's travel distance & speed and activates failsafe if location lost
  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (data) {
      getData('USE_FAILSAFE').then((useFailsafe) => {
        console.log(useFailsafe);
        if (useFailsafe) {
          const { locations } = data;
          batteryLevelAlert();

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

          //console.log(locations[0]);

          //activate failsafe if location is lost
          if (isLocationLost) {
            let speed = Math.max(distanceTravelled / timeTravelled);
            let approxTime = Math.min(distanceRemaining / speed);
            failSafeAlarm(approxTime);
          }
        }
      });
    }
  });

  //failsafe
  const failSafeAlarm = (timeLeft) => {
    setTimeout(() => {
      if (isLocationLost) {
        //sound alarm
        alarmManager.playAlarm();
        Alert.alert('FAILSAFE ACTIVATED', 'Your device gps signal is lost', [
          {
            text: 'Stop Alarm',
            onPress: () => {
              alarmManager.stopAlarm();
              stopTrackPosition();
            },
          },
        ]);
      }
    }, timeLeft);
  };

  //set distance remaining
  const storeDistanceRemain = (value) => {
    setDistanceRemaining(value);
  };

  //load newly set ringtone
  const loadFailsafeAudio = () => {
    alarmManager.loadAudio();
  };

  //battery level checker
  const batteryLevelAlert = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    if (batteryLevel < 0.2 && !isActivated) {
      //sound alarm
      alarmManager.playAlarm();
      setIsActivated(true);
      Alert.alert('FAILSAFE ACTIVATED', 'Your device battery is below the threshold limit', [
        {
          text: 'Stop Alarm',
          onPress: () => {
            alarmManager.stopAlarm();
            stopTrackPosition();
          },
        },
      ]);
    }
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
    clearValues();
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
    setIsActivated(false);
  };

  return {
    checkRequestLocationPerms,
    startTrackPosition,
    stopTrackPosition,
    storeDistanceRemain,
    loadFailsafeAudio,
  };
};

export default FailSafe;
