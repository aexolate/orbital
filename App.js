import 'react-native-gesture-handler'; //MUST BE AT THE TOP OF APP.JS
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawer from './AppDrawer.js';
import { getData, storeData } from './src/utils/AsyncStorage';
import CONSTANTS from './src/constants/Constants';

const App = () => {
  //initialize default settings for new users, otherwise retrieve last saved value
  useEffect(() => {
    getData('radius').then((value) => {
      if (value == null) {
        storeData('radius', 500);
      }
    });
    getData('song').then((value) => {
      if (value == null) {
        storeData('song', CONSTANTS.MUSIC.song1);
      }
    });
    getData('vibration').then((vibration) => {
      if (vibration == undefined) {
        storeData('vibration', false);
      }
    });
    getData('USE_FAILSAFE').then((useFailsafe) => {
      if (useFailsafe == undefined) {
        storeData('USE_FAILSAFE', false);
      }
    });
    getData('batteryThreshold').then((useFailsafe) => {
      if (useFailsafe == undefined) {
        storeData('batteryThreshold', 20);
      }
    });
    getData('volume').then((volume) => {
      if (volume == undefined) {
        storeData('volume', 1);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <AppDrawer />
    </NavigationContainer>
  );
};

export default App;
