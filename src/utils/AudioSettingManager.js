import { useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';
import { getData } from './AsyncStorage';
import { getAlarmVolume, getUseVibration } from './KeysManager';

export const AudioSettingManager = () => {
  const playbackSound = useRef(null);
  const playbackStatus = useRef(null);
  const [currentSongName, setCurrentSongName] = useState('');
  const isPlaying = useRef(false);

  //Stops playing the audio
  const stopAudio = async () => {
    await playbackSound.current.unloadAsync();
    Vibration.cancel();
    setCurrentSongName('');
    isPlaying.current = false;
  };

  //Activates the audio
  const playAudio = async (song) => {
    const { sound, status } = await Audio.Sound.createAsync(song.path);
    //const volume = await getData('volume');
    const volume = await getAlarmVolume();
    sound.setIsLoopingAsync(true);
    playbackSound.current = sound;
    playbackStatus.current = status;
    setCurrentSongName(song.name);

    if (!playbackStatus.current.isPlaying) {
      await playbackSound.current.playAsync();
      await playbackSound.current.setVolumeAsync(volume);
    
      //Vibration
      getUseVibration().then((vibration) => {
        if (vibration) {
          let VIBRATION_PATTERN = [200, 200];
          let VIBRATION_REPEAT = true;
          Vibration.vibrate(VIBRATION_PATTERN, VIBRATION_REPEAT);
        }
      });
      isPlaying.current = true;
    }
  };

  const playingStatus = () => {
    return isPlaying.current;
  };

  const setVolume = async (volume) => {
    if (isPlaying.current) {
      await playbackSound.current.setVolumeAsync(volume);
    }
  };

  return { stopAudio, playAudio, currentSongName, playingStatus, setVolume };
};
export default AudioSettingManager;
