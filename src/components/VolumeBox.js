import React, { useEffect, useRef, useState } from 'react';
import { Alert, View, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Button, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { getData, storeData } from '../utils/AsyncStorage';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Value } from 'react-native-reanimated';

const VolumeBox = (props) => {
  const currentVolume = useRef(1);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getData('volume').then(volume => {
        console.log('get data volume: ', volume);
        currentVolume.current = volume;
      })
      console.log('current volume: ', currentVolume.current);
    }
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      return async () => {
        console.log('store current volume', currentVolume.current);
        storeData('volume', currentVolume.current);
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.audioVolumeText}>
          Audio Volume
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Slider
          style={{ width: 200, height: 40 }}
          value={currentVolume.current}
          minimumTrackTintColor="grey"
          maximumTrackTintColor="#000000"
          onValueChange={(value) => {
            currentVolume.current = value;
            storeData('volume', value);
            props.manager.setVolume(value);
          }}
        />
      </View>
    </View>
  );
};

export default VolumeBox;

VolumeBox.propTypes = {
  manager: PropTypes.object,
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width - 80,
  },
  audioVolumeText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.6,
  },
  rightContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
