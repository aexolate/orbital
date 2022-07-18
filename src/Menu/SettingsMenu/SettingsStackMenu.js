import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsMenu from './SettingsMenu';
import SettingsAudioMenu from './SettingsAudioMenu';

const Stack = createNativeStackNavigator();

const SettingsStackMenu = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={SettingsMenu} options={{ headerShown: false }} />
      <Stack.Screen name="Audio" component={SettingsAudioMenu} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default SettingsStackMenu;
