import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Button, Text, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { getData, storeData } from '../utils/AsyncStorage';
import { useNavigation } from '@react-navigation/native';

const MusicBox = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSound, setPlaybackSound] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (playbackSound == null) {
      initializeAudio();
    }
  }, []);

  //method to initiliaze audio
  const initializeAudio = async () => {
    const { sound, status } = await Audio.Sound.createAsync(props.song.path);
    await sound.setIsLoopingAsync(true);
    setPlaybackSound(sound);
    setPlaybackStatus(status);
  };

  //method to set audio as main alarm
  const setAudio = () => {
    storeData('song', props.song);
    navigation.navigate('Main');
  };

  //method to handle playing and stopping of audio in this component
  const handleAudioPlay = async () => {
    if (playbackStatus.isPlaying) {
      const status = await playbackSound?.stopAsync();
      status.isPlaying = false; //for IOS delay issues
      setIsPlaying(false);
      return setPlaybackStatus(status);
    }

    if (!playbackStatus.isPlaying) {
      const status = await playbackSound?.playAsync();
      status.isPlaying = true; //for IOS delay issues
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{props.song.name}</Text>
        </View>
      </View>
      <Button style={styles.rightContainer} onPress={() => handleAudioPlay()}>
        <Ionicons name={isPlaying ? 'ios-pause-sharp' : 'ios-play'} size={24} color="black" />
      </Button>
      <Button style={styles.setButton} mode="contained" onPress={() => setAudio()}>
        <Text style={styles.setButtonText}>SET</Text>
      </Button>
    </View>
  );
};

MusicBox.propTypes = {
  song: PropTypes.object,
};

export default MusicBox;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width - 80,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'grey',
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButton: {
    height: 50,
    flexBasis: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  setButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleContainer: {
    width: width - 220,
    paddingLeft: 10,
  },
});
