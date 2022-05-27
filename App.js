import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { Platform, StyleSheet, View, StatusBar, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import Geocoder from 'react-native-geocoding';
import { distanceBetween } from './Utils.js'
import { AlarmManager } from './AlarmManager.js'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { Provider as PaperProvider, Searchbar, Button, Card, Title, Paragraph, Snackbar, Text, Portal, Banner, Modal, Surface, Dialog } from 'react-native-paper';

const App = () => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [curLocation, setCurLocation] = useState({ latitude: 0, longitude: 0 })
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 })
  const [previewLocation, setPreviewLocation] = useState({ latitude: 0, longitude: 0 })
  const [distanceToDest, setDistanceToDest] = useState(Infinity)
  const [destinationWord, setDestinationWord] = useState(''); //destination in string for geocoding
  const [isAlarmSet, setIsAlarmSet] = useState(false)  //Indicates whether the alarm has been set
  const [reachedDestination, setReachedDestination] = useState(false)  //Indicates whether the user has been in radius of destination
  let foregroundSubscription = null;
  const alarmManager = AlarmManager();
  const mapRef = useRef(null);

  //Initial map to be centered at Singapore
  const INITIAL_CAMERA = { center: { latitude: 1.3521, longitude: 103.8198 }, pitch: 0, heading: 0, altitude: 0, zoom: 10 };

  //Distance to destination for alarm to activate
  const ACTIVATION_RADIUS = 500;

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

  //Initializing Function
  useEffect(() => {
    Geocoder.init(GOOGLE_MAPS_API_KEY);
    alarmManager.setupAudio();

    requestPermission().then((response) => {
      if (!response.granted) {
        console.log("Foreground permission not granted");
        return;
      }
      startForegroundUpdate();
    });
  }, [])


  //Effect when curLocation/destination is changed
  React.useEffect(() => {
    //Recalculate distance based on new locations
    let distanceRemaining = distanceBetween(curLocation, destination);
    setDistanceToDest(distanceRemaining);

    //Triggers the alarm if location is within range of destination
    if (distanceRemaining <= ACTIVATION_RADIUS && isAlarmSet) {
      setReachedDestination(true);
      alarmManager.playAlarm();
    }
  }, [curLocation, destination]);


  //selecting destination via geocoding: word to coordinate
  const selectLocGeocode = (prop) => {
    Geocoder.from(prop)
      .then(json => {
        var location = json.results[0].geometry.location;
        const dest = {
          latitude: location.lat,
          longitude: location.lng,
        };
        setLocConfirmation(dest);
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        Alert.alert('Geocoding Error', JSON.stringify(error));
      });
  }

  //selecting destination via longpress
  const selectLocLongPress = (mapEvent) => {
    if (isAlarmSet) return;   //Do nothing on long press if alarm is already set

    const destination = {
      latitude: mapEvent.coordinate.latitude,
      longitude: mapEvent.coordinate.longitude,
    };
    setLocConfirmation(destination);
  }

  //function to get user to confirm is this is the destination they want to set as alarm
  const setLocConfirmation = (dest) => {
    setPreviewLocation(dest);
    setPromptVisible(true);
    const animateObj = { pitch: 0, heading: 0, zoom: 15 }
    mapRef.current.animateCamera({ center: dest, ...animateObj }, { duration: 1000 });
  };

  const unsetAlarm = () => {
    setIsAlarmSet(false);
    setReachedDestination(false);
    alarmManager.stopAlarm();
  };

  const searchLocation = () => {
    selectLocGeocode(destinationWord);
  }

  const [hintVisible, setHintVisible] = React.useState(true);
  const [promptVisible, setPromptVisible] = React.useState(false);
  const onDismissSnackBar = () => setHintVisible(false);

  //Render
  return (
    <PaperProvider>

      <View style={styles.container}>

        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialCamera={INITIAL_CAMERA}
          zoomControlEnabled={true}
          showsUserLocation={true}
          mapPadding={{ top: StatusBar.currentHeight }}   //Keeps map elements within view such as 'Locate' button
          onLongPress={(mapEvent) => { selectLocLongPress(mapEvent.nativeEvent) }}>

          {/* Destination Marker */}
          {isAlarmSet &&
            <View>
              <MapView.Circle
                radius={ACTIVATION_RADIUS}
                center={destination}
                strokeWidth={2}
                strokeColor={'#fe5f55'}
                fillColor={'rgba(254,95,85,0.3)'} />

              <MapView.Marker
                coordinate={destination}
                pinColor='#fe5f55'
                title='Destination' />
            </View>
          }

          {/* Preview Circle */
            promptVisible &&
            < MapView.Circle
              radius={ACTIVATION_RADIUS}
              center={previewLocation}
              strokeWidth={2}
              strokeColor={'#d0d61c'}
              fillColor={'rgba(208, 214, 28,0.3)'}
            />}

        </MapView>

        {isAlarmSet && !reachedDestination &&
          <Card style={styles.infoBox}>
            <Card.Content>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}> {'Distance to Destination: ' + (distanceToDest / 1000).toFixed(2) + ' km'} </Text>
              <Button icon='cancel' mode='contained' onPress={unsetAlarm}>Cancel Alarm</Button>
            </Card.Content>
          </Card>
        }

        {!isAlarmSet &&
          <View style={styles.searchBar}>
            <Searchbar
              placeholder='Search Location'
              onIconPress={searchLocation}
              onSubmitEditing={searchLocation}
              onChangeText={setDestinationWord}
              value={destinationWord}
            />
          </View>
        }

        <Snackbar
          visible={hintVisible}
          onDismiss={onDismissSnackBar}
          action={{ label: 'Dismiss' }}>
          Search the address or long-press on the map to set the alarm
        </Snackbar>

        {reachedDestination &&
          <Card>
            <Card.Title title="Destination Reached" />
            <Card.Content>
              <Button icon='alarm-off' mode='contained' onPress={unsetAlarm}>Dismiss Alarm</Button>
            </Card.Content>
          </Card>
        }

        <Banner
          visible={promptVisible}
          actions={[
            {
              label: 'Set Destination',
              onPress: () => {
                setDestination(previewLocation);
                setIsAlarmSet(true); +
                  setPromptVisible(false)
              }
            },
            {
              label: 'Cancel',
              onPress: () => setPromptVisible(false)
            },
          ]}>
          Would you like to set this as your destination?
        </Banner>
      </View>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
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
  },
  searchBar: {
    position: 'absolute',
    width: '80%',
    opacity: 0.95,
    top: '15%',
    alignSelf: 'center'
  },
  infoBox: {
    position: 'absolute',
    alignItems: 'center',
    opacity: 0.90,
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
  }
})