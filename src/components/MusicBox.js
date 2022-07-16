import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Button, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { storeData } from '../utils/AsyncStorage';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';

const MusicBox = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackSound = useRef(null);
  const playbackStatus = useRef(null);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (playbackSound.current == null) {
      initializeAudio();
    }
  }, []);

 
  useFocusEffect(
    React.useCallback(() => {
      return async () => {
        console.log("unmount", isPlaying);
        if (playbackStatus.current.isPlaying) {
          const status = await playbackSound.current.stopAsync();
          status.isPlaying = false; //for IOS delay issues
          setIsPlaying(false);
          playbackStatus.current = status; 
          return; 
        }      
      };
    }, [])
  );

  //method to initiliaze audio
  const initializeAudio = async () => {
    const { sound, status } = await Audio.Sound.createAsync(props.song.path);
    sound.setIsLoopingAsync(true);
    playbackSound.current = sound;
    playbackStatus.current = status;
  };

  //method to set audio as main alarm
  const setAudio = () => {
    storeData('song', props.song);
    navigation.navigate('Main');
  };

  //method to handle playing and stopping of audio in this component
  const handleAudioPlay = async () => {

    if (playbackStatus.current.isPlaying) {
      const status = await playbackSound.current.stopAsync();
      status.isPlaying = false; //for IOS delay issues
      setIsPlaying(false);
      playbackStatus.current = status; 
      return; 
    }

    if (!playbackStatus.current.isPlaying) {
      const status = await playbackSound.current.playAsync();
      status.isPlaying = true; //for IOS delay issues
      setIsPlaying(true);
      playbackStatus.current = status;
      return;
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
