import React, { useState, useEffect } from 'react';
import { Searchbar } from 'react-native-paper';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';

const LocationSearchbar = (props) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    Location.setGoogleApiKey(GOOGLE_MAPS_API_KEY);
  }, []);

  const searchLocation = async () => {
    await Location.geocodeAsync(searchText, { useGoogleMaps: true })
      .then((result) => {
        if (result.length == 0) {
          Alert.alert('Geocoding Error', 'No such location found, please be more specific');
          return;
        }
        props.onResultReady({ latitude: result[0].latitude, longitude: result[0].longitude });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Searchbar
      placeholder="Search Location"
      onIconPress={searchLocation}
      onSubmitEditing={searchLocation}
      onChangeText={setSearchText}
      value={searchText}
    />
  );
};

LocationSearchbar.propTypes = {
  onResultReady: PropTypes.func,
};

export default LocationSearchbar;
