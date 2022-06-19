import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapMenu from './src/Menu/MapMenu';
import SettingsMenu from './src/Menu/SettingsMenu';
import DirectionsMenu from './src/Menu/DirectionsMenu';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator useLegacyImplementation>
      <Drawer.Screen name="Map" component={MapMenu} />
      <Drawer.Screen name="Settings" component={SettingsMenu} />
      <Drawer.Screen name="Directions" component={DirectionsMenu} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
