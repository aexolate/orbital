import 'react-native-gesture-handler'; //MUST BE AT THE TOP OF APP.JS
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawer from './AppDrawer.js';
import { getData, storeData } from './src/utils/AsyncStorage.js';

const App = () => {

  return (
    <NavigationContainer>
      <AppDrawer />
    </NavigationContainer>
  );
};

export default App;
