import 'react-native-gesture-handler'; //MUST BE AT THE TOP OF APP.JS
import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawer from './AppDrawer.js';
import { getData, storeData } from './src/utils/AsyncStorage.js';

const App = () => {

  //initialize default radius for new users, otherwise retrieve last saved value
  useEffect(() => {
    getData('radius').then(value => {
      if (value == null) {
        storeData('radius', 500);
      }
    })
  })

  return (
    <NavigationContainer>
      <AppDrawer />
    </NavigationContainer>
  );
};

export default App;
