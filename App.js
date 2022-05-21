import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';



export default class App extends React.Component {
  state = {
    textValue: 'empty'
  };

  async componentDidMount() {
    console.log('mount');
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
            console.log(location);
            this.setState({textValue: location.coords.latitude + ',' + location.coords.longitude});
          }
        )
      }
    } catch (err) {

    }
  }


  render() {
    console.log('render')
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
        <MapView
          style={{ flex: 1 }}
          showsUserLocation = {true}
        />
        <View style={{ position: 'absolute', bottom: '0%', alignSelf: 'stretch', backgroundColor: 'white' }}>
          <Text> {'Current GPS: ' + this.state.textValue} </Text>
        </View>

      </View>


    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center'
  }
})