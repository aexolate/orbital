import { useState } from 'react';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';
import { getData } from './src/utils/AsyncStorage';

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
    const song = await getData('song');
    console.log('MAP LOADED SONG: ', song);
    const { sound, status } = await Audio.Sound.createAsync(song.path);
    console.log('MAP LOADED SOUND/STATUS: ', sound, status);
    setSound(sound);
    setStatus(status);
    await sound.setIsLoopingAsync(true);
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

  return { setupAudio, loadAudio, stopAlarm, playAlarm };
};
export default AlarmManager;
