import React from 'react';
import { Alert, View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { storeData } from '../utils/AsyncStorage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { storeAlarmSong } from '../utils/KeysManager';

const MusicBox = (props) => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      return async () => {
        if (props.manager.playingStatus()) {
          await props.manager.stopAudio();
          return;
        }
      };
    }, []),
  );

  //method to set audio as main alarm
  const setAudio = () => {
    //storeData('song', props.song);
    storeAlarmSong(props.song);
    Alert.alert('Alarm song set!', 'The alarm song is now ' + props.song.name + '!');
    navigation.navigate('Map');
  };

  //method to handle playing and stopping of audio in this component
  const handleAudioPlay = async () => {
    if (props.manager.playingStatus && props.manager.currentSongName == props.song.name) {
      props.manager.stopAudio();
      return;
    } else {
      if (props.manager.playingStatus()) {
        props.manager.stopAudio();
      }
      props.manager.playAudio(props.song);
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
        <Ionicons
          name={props.manager.currentSongName == props.song.name ? 'ios-pause-sharp' : 'ios-play'}
          size={24}
          color="black"
        />
      </Button>
      <Button style={styles.setButton} mode="contained" onPress={() => setAudio()}>
        <Text style={styles.setButtonText}>SET</Text>
      </Button>
    </View>
  );
};

MusicBox.propTypes = {
  song: PropTypes.object,
  manager: PropTypes.object,
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
