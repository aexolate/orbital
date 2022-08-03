import { useState } from 'react';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';

export const AudioSettingManager = () => {
  const [sound, setSound] = useState(null);
  const [status, setStatus] = useState(null);
  const [currentSongName, setCurrentSongName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  //Stops playing the audio
  const stopAudio = async () => {
    sound?.stopAsync().then(() => {
      Vibration.cancel();
      setCurrentSongName('');
      setIsPlaying(false);
    });
  };

  //Activates the audio
  const playAudio = async (song) => {
    const { sound, status } = await Audio.Sound.createAsync(song.path);
    setSound(sound);
    setStatus(status);
    await sound.setIsLoopingAsync(true);
    setCurrentSongName(song.name);
    console.log(currentSongName); //test

    if (!status.isPlaying) {
      await sound?.playAsync();
      //Vibration
      let VIBRATION_PATTERN = [200, 200];
      let VIBRATION_REPEAT = true;
      Vibration.vibrate(VIBRATION_PATTERN, VIBRATION_REPEAT);
      setIsPlaying(true);
    }
  };

  const playingStatus = () => {
    return isPlaying;
  };

  return { stopAudio, playAudio, currentSongName, playingStatus };
};
export default AudioSettingManager;
