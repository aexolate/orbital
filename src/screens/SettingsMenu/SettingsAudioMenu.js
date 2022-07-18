import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import MusicBox from '../../components/MusicBox';
import CONSTANTS from '../../constants/Constants.js';
import PropTypes from 'prop-types';

const SettingsAudioMenu = ({ navigation }) => {
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
      <MusicBox song={CONSTANTS.MUSIC.song1}></MusicBox>
      <MusicBox song={CONSTANTS.MUSIC.song2}></MusicBox>
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
