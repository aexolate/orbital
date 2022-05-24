import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export default class App extends React.Component {
  state = {
    textValue: 'empty',
    currentLat: 0,
    currentLong: 0,
    destLat: 1.2962582131565663,  //TODO: Set the destination using geocoding/pinpoint
    destLong: 103.77629052145139  //This is just placeholder value for testing
  };

  //TODO: Encapsulate the function elsewhere
  //Returns the great-circle distance between two coordinates using haversine formula
  //i.e. Shortest distance over earth's surface
  distanceBetween(lat1, lon1, lat2, lon2) {
    let R = 6371e3;                 //Earth's Radius 6371km
    let phi1 = lat1 * Math.PI / 180;
    let phi2 = lat2 * Math.PI / 180;
    let dPhi = (lat2 - lat1) * Math.PI / 180;
    let dLambda = (lon2 - lon1) * Math.PI / 180;
    let a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;   //distance in metres
  }

  //TODO: Modify the location tracking to continue tracking in background
  async componentDidMount() {
    try {
      const foregroundPermission = await Location.requestForegroundPermissionsAsync()
      let locationSubscrition = null

      // Location tracking inside the component
      if (foregroundPermission.granted) {
        foregroundSubscrition = Location.watchPositionAsync(
          {
            // Tracking options
            accuracy: Location.Accuracy.High,
            distanceInterval: 1
          },
          location => {
            //console.log(location);  //Debugging Function
            this.setState({ currentLong: location.coords.longitude, currentLat: location.coords.latitude });
          }
        )
      }
    } catch (err) {

    }
  }


  render() {
    return (
      <View style={styles.map}>
        <MapView
          style={{ flex: 1 }}
          showsUserLocation={true}
        />
        <View style={{ position: 'absolute', bottom: '0%', alignSelf: 'stretch', backgroundColor: 'white' }}>
          {/* Debugging info to be removed in release version */}
          <Text> {'Current GPS: ' + this.state.currentLat + ',' + this.state.currentLong} </Text>
          <Text> {'Distance to Destination: ' + this.distanceBetween(this.state.currentLat, this.state.currentLong, this.state.destLat, this.state.destLong).toFixed(2) + 'm'} </Text>
        </View>

      </View>


    );
  }
}


const styles = StyleSheet.create({
  center: {
    alignItems: 'center'
  },
  map: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 300
  }
})