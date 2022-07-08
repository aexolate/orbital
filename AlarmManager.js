import { useState } from 'react';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';

export const AlarmManager = () => {
  const [sound, setSound] = useState(null);
  const [status, setStatus] = useState(null);

  //Setup audio instance and load audio in. To be called during init.
  const setupAudio = async () => {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });

    const { sound, status } = await Audio.Sound.createAsync(require('./assets/morning_glory.mp3'));
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
    console.log('play alarm');

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

  return { setupAudio, stopAlarm, playAlarm };
};
export default AlarmManager;
