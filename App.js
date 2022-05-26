import React, { useEffect, useState, ReactElement } from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar, TextInput, Vibration, Pressable, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import Geocoder from 'react-native-geocoding';
import { Audio } from 'expo-av';
import { distanceBetween } from './Utils.js'
import { AlarmManager } from './AlarmManager.js'
import config from './config.js';

const App = () => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [curLocation, setCurLocation] = useState({ latitude: 0, longitude: 0 })
  const [destination, setDestination] = useState({ latitude: 1.418916501296272, longitude: 103.6979021740996 }) //placeholder destination
  const [distanceToDest, setDistanceToDest] = useState(Infinity)
  const [destinationWord, setDestinationWord] = useState(''); //destination in string for geocoding
  const [isAlarmSet, setIsAlarmSet] = useState(false)  //Indicates whether the alarm has been set

  const ACTIVATION_RADIUS = 500;
  let foregroundSubscription = null;
  const alarmManager = AlarmManager();

  //Initializing Function
  useEffect(() => {
    alarmManager.setupAudio();
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

  //React hook for curLocation
  React.useEffect(() => {
    setDistanceToDest(distanceBetween(curLocation, destination).toFixed(0));
    if (distanceToDest <= ACTIVATION_RADIUS && isAlarmSet) {
      alarmManager.playAlarm();
    }
  }, [curLocation]);

  //selecting destination via geocoding: word to coordinate
  const selectLocGeocode = (prop) => {
    Geocoder.init(config.API_KEY);
    Geocoder.from(prop)
      .then(json => {
        var location = json.results[0].geometry.location;
        const dest = {
          latitude: location.lat,
          longitude: location.lng
        };
        setLocConfirmation(dest);
      })
      .catch(error => console.warn(error));
  }

  //selecting destination via longpress
  const selectLocLongPress = (prop) => {
    const dest = {
      latitude: prop.coordinate.latitude,
      longitude: prop.coordinate.longitude
    };
    setLocConfirmation(dest);
  }

  //function to get user to confirm is this is the destination they want to set as alarm
  const setLocConfirmation = (dest) => {
        Alert.alert(
        null,
        'Would you like to set as your destination?',
        [{
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Set Alarm',
          onPress: () => {
            console.log('destination set: ' + JSON.stringify(dest));
            setDestination(dest);
            setDistanceToDest(distanceBetween(curLocation, dest).toFixed(0));

            setIsAlarmSet(true);
            alert('alarn SET!');
          }
        }],
      )
    };

  //Render
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        mapPadding={{ top: StatusBar.currentHeight }}   //Keeps map elements within view such as 'Locate' button
        onLongPress={(prop) => { selectLocLongPress(prop.nativeEvent) }}>
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

      <View style={styles.distanceAndAlarm}>
        {/* Debugging Info */}
        <Text> {'Current Location: ' + curLocation?.latitude + ',' + curLocation?.longitude} </Text>
        <Text> {'Distance to Destination: ' + distanceToDest + ' m'} </Text>
        <Button title="Test Alarm" onPress={alarmManager.playAlarm} />
        <Button title="Stop Alarm" onPress={alarmManager.stopAlarm} />
      </View>

      <TextInput
        style={styles.input}
        onChangeText={setDestinationWord}
        value={destinationWord}
        placeholder='!input final destination!'
        selectionColor='#003D7C'
      />
      <Pressable
        onPress={() => { selectLocGeocode(destinationWord) }}
        style={styles.button}
      >
        <Text>Search Destination</Text>
      </Pressable>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 6,
    paddingTop: StatusBar.currentHeight
  },
  distanceAndAlarm: {
    flex: 2,
    curLocation: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  input: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  button: {
    flex: 1,
    backgroundColor: '#003D7C',
    borderColor: '#000000',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'flex-end',
  }
})