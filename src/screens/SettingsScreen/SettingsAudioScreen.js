import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import MusicBox from '../../components/MusicBox';
import VolumeBox from '../../components/VolumeBox';
import AudioSettingManager from '../../utils/AudioSettingManager';
import CONSTANTS from '../../constants/Constants.js';
import PropTypes from 'prop-types';

const SettingsAudioMenu = ({ navigation }) => {
  const audioSettingsManager = AudioSettingManager();

  return (
    <View>
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => {
          navigation.navigate('Main');
        }}
      >
        Back to Settings
      </Button>
      <VolumeBox manager={audioSettingsManager}></VolumeBox>
      <MusicBox song={CONSTANTS.MUSIC.song1} manager={audioSettingsManager}></MusicBox>
      <MusicBox song={CONSTANTS.MUSIC.song2} manager={audioSettingsManager}></MusicBox>
      <MusicBox song={CONSTANTS.MUSIC.song3} manager={audioSettingsManager}></MusicBox>
    </View>
  );
};

export default SettingsAudioMenu;

SettingsAudioMenu.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  button: {
    paddingTop: 5,
    paddingBottom: 5,
  },
});
