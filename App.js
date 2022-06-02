import 'react-native-gesture-handler'; //MUST BE AT THE TOP OF APP.JS
import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { Platform, StyleSheet, View, StatusBar, Alert } from 'react-native';
import { Provider as PaperProvider, Button, Card, Text, Banner } from 'react-native-paper';
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
