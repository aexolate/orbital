import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, Keyboard, StatusBar, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Divider, ActivityIndicator, Surface } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { decode } from '@mapbox/polyline';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';

const DirectionsMenu = ({ navigation }) => {
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [coords, setCoords] = useState([]);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    mapRef.current.fitToCoordinates(coords);
  }, [coords]);

  const searchDirections = (start, end) => {
    if (!start || !end) {
      Alert.alert('Missing Values', 'Input your origin and destination', [{ text: 'OK' }]);
      return;
    }

    Keyboard.dismiss();

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=transit&key=${GOOGLE_MAPS_API_KEY}`;
      const response = fetch(url)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.status != 'OK') {
            Alert.alert('Directions Error', 'Status: ' + resJson.status, [{ text: 'OK' }]);
            return;
          }

          setDirections([]);

          //Coordinates used to draw the path from origin to destination
          const polyline = resJson.routes[0].overview_polyline.points;
          const points = decode(polyline).map((point) => {
            return { latitude: point[0], longitude: point[1] };
          });
          setCoords(points);

          //Data used to indicate transit transfer and destination points
          const markers = resJson.routes[0].legs[0].steps
            .filter((s) => s.travel_mode == 'TRANSIT')
            .map((s) => {
              const distance = s.distance.text;
              const duration = s.duration.text;
              const departure = s.transit_details.departure_stop.name;
              const arrival = s.transit_details.arrival_stop.name;
              const line = s.transit_details.line.name;

              const checkpoint =
                line + ' | ' + distance + ' | ' + duration + '\n' + departure + ' -> ' + arrival;
              setDirections((dirs) => [...dirs, checkpoint]);

              return {
                coords: { latitude: s.end_location.lat, longitude: s.end_location.lng },
                title: s.transit_details.line.name + ' | ' + s.transit_details.arrival_stop.name,
              };
            });
          setMarkers(markers);
        });
    } catch (error) {
      Alert.alert('Error', error, [{ text: 'OK' }]);
    }
  };

  const clearPreview = () => {
    setMarkers([]);
    setCoords([]);
    setOriginText('');
    setDestinationText('');
    setDirections([]);
  };

  const setAlarm = () => {
    if (markers.length == 0) {
      Alert.alert('No waypoints found', 'Please search for directions with transit stops', [
        { text: 'OK' },
      ]);
      return;
    }

    Alert.alert('Confirm', 'Are you sure you want to set the following waypoints?', [
      { text: 'OK', onPress: () => navigation.navigate('Map', { requests: markers }) },
      { text: 'Cancel' },
    ]);
    return;
  };

  const setOriginToCurrent = () => {
    Location.getCurrentPositionAsync().then((loc) => {
      setOriginText(loc.coords.latitude + ', ' + loc.coords.longitude);
    });
  };

  return (
    <View style={{ flex: 1, padding: 5 }}>
      <TextInput
        label="Origin"
        mode="outlined"
        dense
        value={originText}
        onChangeText={(txt) => setOriginText(txt)}
        right={<TextInput.Icon name="crosshairs-gps" onPress={setOriginToCurrent} />}
      />
      <TextInput
        label="Destination"
        mode="outlined"
        dense
        value={destinationText}
        onChangeText={(txt) => setDestinationText(txt)}
      />

      <View style={{ paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          mode="contained"
          color="darkblue"
          disabled={originText == '' || destinationText == ''}
          style={{ width: 115 }}
          icon="magnify"
          onPress={() => searchDirections(originText, destinationText)}
        >
          Search
        </Button>

        <Button
          mode="contained"
          color="green"
          disabled={markers.length == 0}
          style={{ width: 130 }}
          icon="check-outline"
          onPress={setAlarm}
        >
          Set Alarm
        </Button>

        <Button
          mode="contained"
          color="darkred"
          style={{ width: 115 }}
          icon="close"
          onPress={clearPreview}
        >
          Clear
        </Button>
      </View>

      <View style={{ flex: 1, paddingTop: 10 }}>
        <MapView ref={mapRef} zoomControlEnabled showsUserLocation style={{ flex: 1 }}>
          {markers.map((m, index) => (
            <Marker
              key={index}
              coordinate={m.coords}
              title={m.title}
              //description="test"
            ></Marker>
          ))}

          <Polyline
            coordinates={coords}
            strokeWidth={6}
            strokeColor={'rgba(0, 132, 184, 0.8)'}
          />
        </MapView>
      </View>

      <View style={{ maxHeight: 150, padding: 5 }}>
        <ScrollView persistentScrollbar={true}>
          {directions.map((d, idx) => (
            <Surface key={idx} style={styles.surface}>
              <Text>{d}</Text>
            </Surface>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
DirectionsMenu.propTypes = {
  navigation: PropTypes.any.isRequired,
};
export default DirectionsMenu;
const styles = StyleSheet.create({
  surface: {
    padding: 8,
    height: 55,
    justifyContent: 'center',
  },
});
