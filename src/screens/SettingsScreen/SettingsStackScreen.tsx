import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './SettingsScreen';
import SettingsAudioScreen from './SettingsAudioScreen';

const Stack = createNativeStackNavigator();

const SettingsStackMenu = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Audio" component={SettingsAudioScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default SettingsStackMenu;
