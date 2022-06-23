import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapMenu from './src/Menu/MapMenu';
import SettingsMenu from './src/Menu/SettingsMenu';
import DirectionsMenu from './src/Menu/DirectionsMenu';
import PermissionsMenu from './src/Menu/PermissionsMenu';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator useLegacyImplementation>
      <Drawer.Screen name="Map" component={MapMenu} initialParams={{ activationRdius: 500 }} />
      <Drawer.Screen name="Settings" component={SettingsMenu} />
      <Drawer.Screen name="Directions" component={DirectionsMenu} />
      <Drawer.Screen name="Permissions" component={PermissionsMenu} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
