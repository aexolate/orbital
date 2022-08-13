import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { getAlarmVolume, storeAlarmVolume } from '../utils/KeysManager';

const VolumeBox = (props) => {
  const currentVolume = useRef(1); //for any change in value, so that volume will be updated in asyncStorage upon exit
  const [initialVolume, setInitialVolume] = useState(1); //only for initial render, to trigger re-render

  useEffect(() => {
    getAlarmVolume().then((volume) => {
      currentVolume.current = volume;
      setInitialVolume(volume);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return async () => {
        storeAlarmVolume(currentVolume.current);
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.audioVolumeText}>Audio Volume</Text>
      </View>
      <View style={styles.rightContainer}>
        <Slider
          style={{ width: 200, height: 40 }}
          value={initialVolume}
          minimumTrackTintColor="grey"
          maximumTrackTintColor="#000000"
          onValueChange={(value) => {
            currentVolume.current = value;
            storeAlarmVolume(value);
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
