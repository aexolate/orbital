import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapMenu from './src/Menu/MapMenu';
import SettingsMenu from './src/Menu/SettingsMenu';
import DirectionsMenu from './src/Menu/DirectionsMenu';
import PermissionsMenu from './src/Menu/PermissionsMenu';
import FavouritesMenu from './src/Menu/FavouritesMenu';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{
        headerShown: true,
      }}
    >
      <Drawer.Screen name="Map" component={MapMenu} options={{ headerShown: false }} />
      <Drawer.Screen name="Settings" component={SettingsMenu} />
      <Drawer.Screen name="Directions" component={DirectionsMenu} />
      <Drawer.Screen name="Favourites" component={FavouritesMenu} />
      <Drawer.Screen name="Permissions" component={PermissionsMenu} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
