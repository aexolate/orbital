import 'react-native-gesture-handler'; //MUST BE AT THE TOP OF APP.JS
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawer from './AppDrawer.js';

const App = () => {
  return (
    <NavigationContainer>
      <AppDrawer />
    </NavigationContainer>
  );
};

export default App;
