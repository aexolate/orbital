import React, { useEffect, useRef } from 'react';
import { View, Text, Alert, Keyboard } from 'react-native';
import { TextInput, Button, Divider, ActivityIndicator } from 'react-native-paper';
import MapView from 'react-native-maps';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { decode } from '@mapbox/polyline';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';

const DirectionsMenu = ({ navigation }) => {
  //https://maps.googleapis.com/maps/api/directions/json?origin=670507&destination=NUS&mode=driving&altnernatives=true&key=YOUR_API_KEY

  const [originText, setOriginText] = React.useState('');
  const [destinationText, setDestinationText] = React.useState('');
  const [coords, setCoords] = React.useState([]);
  const [markers, setMarkers] = React.useState([]);
  const mapRef = useRef(null);

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
      //console.log(url);
      const response = fetch(url)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.status != 'OK') {
            Alert.alert('Directions Error', 'Status: ' + resJson.status, [{ text: 'OK' }]);
            return;
          }

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
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        label="Origin"
        mode="outlined"
        value={originText}
        onChangeText={(txt) => setOriginText(txt)}
        right={<TextInput.Icon name="crosshairs-gps" onPress={setOriginToCurrent} />}
      />
      <TextInput
        label="Destination"
        mode="outlined"
        value={destinationText}
        onChangeText={(txt) => setDestinationText(txt)}
      />
      <Button mode="contained" onPress={() => searchDirections(originText, destinationText)}>
        Search
      </Button>

      <View style={{ flex: 1, padding: 10 }}>
        <MapView ref={mapRef} zoomControlEnabled showsUserLocation style={{ flex: 1 }}>
          {markers.map((m, index) => (
            <MapView.Marker
              key={index}
              coordinate={m.coords}
              title={m.title}
              description="test"
            ></MapView.Marker>
          ))}

          <MapView.Polyline
            coordinates={coords}
            strokeWidth={6}
            strokeColor={'rgba(0, 132, 184, 0.8)'}
          />
        </MapView>
        <Button color="green" mode="contained" onPress={setAlarm}>
          Set Alarms
        </Button>
      </View>
    </View>
  );
};
DirectionsMenu.propTypes = {
  navigation: PropTypes.any.isRequired,
};
export default DirectionsMenu;
