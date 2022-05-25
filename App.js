import React, { useEffect, useState, ReactElement } from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar, TextInput, Vibration } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Audio } from 'expo-av';
import { distanceBetween } from './Utils.js'

const App = () => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  
  const [curLocation, setCurLocation] = useState({ latitude: 0, longitude: 0 })
  const [destination, setDestination] = useState({ latitude: 1.418916501296272, longitude: 103.6979021740996 }) //placeholder destination
  const [distanceToDest, setDistanceToDest] = useState(Infinity)
  
  const [sound, setSound] = useState(null)
  const [isRinging, setIsRinging] = useState(false)    //Indicates if the alarm is already ringing
  const [isAlarmSet, setIsAlarmSet] = useState(false)  //Indicates whether the alarm has been set

  const ACTIVATION_RADIUS = 500;
  let foregroundSubscription = null;

  async function stopSound() {
    await sound.setIsLoopingAsync(false);
    await sound.stopAsync();
    await sound.unloadAsync();
    Vibration.cancel();
    setIsRinging(false);
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/morning_glory.mp3')
    );
    setSound(sound);
    await sound.setIsLoopingAsync(true);
    sound.playAsync();
    console.log('vibration');
    Vibration.vibrate([0, 200, 100, 200, 500], true);
  }


  useEffect(() => {
    console.log('useEffect()');

    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync()
      //if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
    };
    requestPermission().then((response) => {
      if (!response.granted) {
        console.log("Foreground permission not granted");
        return;
      }
      startForegroundUpdate();
    });
  }, [])


  const startForegroundUpdate = async () => {
    foregroundSubscription?.remove()
    foregroundSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000
      },
      location => {
        setCurLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude })
      }
    )
  };

  //React hook for current location
  React.useEffect(() => {
    setDistanceToDest(distanceBetween(curLocation, destination).toFixed(0));
    if (distanceToDest <= ACTIVATION_RADIUS && !isRinging && isAlarmSet) {
      playSound();
      setIsRinging(true);
    }
  }, [curLocation]);

  //Render
  return (
    <View style={styles.map}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
      >
        <MapView.Circle
          radius={ACTIVATION_RADIUS}
          center={destination}
          strokeWidth={2}
          strokeColor={'#1a66ff'}
          fillColor={'rgba(230,238,255,0.6)'}
        >
        </MapView.Circle>

        <MapView.Marker
          coordinate={destination}
          pinColor='#1a66ff'
          title='Destination'
        >
        </MapView.Marker>
      </MapView>

      <View style={{ curLocation: 'absolute', bottom: '0%', alignSelf: 'stretch', backgroundColor: 'white' }}>
        {/* Debugging Info */}
        <Text> {'Current Location: ' + curLocation?.latitude + ',' + curLocation?.longitude} </Text>
        <Text> {'Distance to Destination: ' + distanceToDest + ' m'} </Text>
        <Button title="Test Alarm" onPress={playSound} />
        <Button title="Stop Alarm" onPress={stopSound} />
      </View>

    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center'
  },
  map: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  }
})