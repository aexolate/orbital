import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SettingsMenu from './SettingsMenu';
import SettingsAudioMenu from './SettingsAudioMenu';

const Stack = createNativeStackNavigator();

const SettingsStackMenu = () => {
    return(
    <Stack.Navigator>
        <Stack.Screen name = "Settings Main" component={SettingsMenu} />
        <Stack.Screen name = "Settings Audio" component={SettingsAudioMenu} />
    </Stack.Navigator>
    )
}

export default SettingsStackMenu;