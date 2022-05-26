import React, { useEffect, useState, ReactElement } from 'react';
import { Platform, StyleSheet, Text, View, Button, StatusBar, TextInput, Vibration, Pressable, Alert } from 'react-native';
import { Audio } from 'expo-av';

export const AlarmManager = () => {
  const [sound, setSound] = useState(null)
  //Setup audio instance and load audio in. To be called during init.
  const setupAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/morning_glory.mp3')
    );
    setSound(sound);
    await sound.setIsLoopingAsync(true);
  }

  //Stops playing the alarm
  const stopAlarm = async () => {
    await sound.stopAsync();
    Vibration.cancel();
  }

  //Activates the alarm
  const playAlarm = async () => {
    if (sound == null) {
      console.error("setupAudio() must be called")
      return;
    }
    
    if (!sound.isPlaying) {
      await sound.playAsync();
    }

    //Vibration
    let VIBRATION_PATTERN = [0, 200, 100, 200, 500];
    let VIBRATION_REPEAT = true;
    Vibration.vibrate(VIBRATION_PATTERN, VIBRATION_REPEAT);
  }

  return {setupAudio, stopAlarm, playAlarm};
}
export default AlarmManager;