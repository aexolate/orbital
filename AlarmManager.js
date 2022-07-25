import { useState } from 'react';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';
import { getData } from './src/utils/AsyncStorage';
import CONSTANTS from './src/constants/Constants';

export const AlarmManager = () => {
  const [sound, setSound] = useState(null);
  const [status, setStatus] = useState(null);

  //Setup audio instance and load audio in. To be called during init.
  const setupAudio = async () => {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });

    loadAudio();
  };

  const loadAudio = async () => {
    let song = await getData('song');
    if(song == null) {
      song = CONSTANTS.MUSIC.song1;
    }
    const { sound, status } = await Audio.Sound.createAsync(song.path);
    setSound(sound);
    setStatus(status);
    await sound.setIsLoopingAsync(true);
  };

  const unloadAudio = async () => {
    await sound?.unloadAsync();
    setSound(null);
    setStatus(null);
  };

  //Stops playing the alarm
  const stopAlarm = async () => {
    await sound?.stopAsync();
    Vibration.cancel();
  };

  //Activates the alarm
  const playAlarm = async () => {
    if (sound == null) {
      console.error('setupAudio() must be called');
      return;
    }

    //BUG: isPlaying is always false
    if (!status.isPlaying) {
      await sound?.playAsync();
      //Vibration
      let VIBRATION_PATTERN = [200, 200];
      let VIBRATION_REPEAT = true;
      Vibration.vibrate(VIBRATION_PATTERN, VIBRATION_REPEAT);
    }
  };

  return { setupAudio, loadAudio, stopAlarm, playAlarm, unloadAudio };
};
export default AlarmManager;
