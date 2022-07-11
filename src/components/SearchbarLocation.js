import React, { useState, useEffect } from 'react';
import { Searchbar, HelperText } from 'react-native-paper';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { View, Alert } from 'react-native';
import PropTypes from 'prop-types';

const SearchbarLocation = (props) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    Location.setGoogleApiKey(GOOGLE_MAPS_API_KEY);
  }, []);

  const searchLocation = async () => {
    //Do not send geocode request if textbox is empty
    if (searchText == '') {
      return;
    }

    await Location.geocodeAsync(searchText, { useGoogleMaps: true })
      .then((result) => {
        if (result.length == 0) {
          Alert.alert('Geocoding Error', 'No such location found, please be more specific');
          return;
        }
        props.onResultReady({ latitude: result[0].latitude, longitude: result[0].longitude });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View>
      <Searchbar
        placeholder="Search Location"
        onIconPress={searchLocation}
        onSubmitEditing={searchLocation}
        onChangeText={setSearchText}
        value={searchText}
      />
      <HelperText style={{ backgroundColor: 'white' }}>
        or long-press the map to start setting alarm
      </HelperText>
    </View>
  );
};

SearchbarLocation.propTypes = {
  onResultReady: PropTypes.func,
};

export default SearchbarLocation;
