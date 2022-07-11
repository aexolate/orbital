import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapScreen from './src/screens/MapScreen';
import SettingsMenu from './src/screens/SettingsMenu';
import DirectionsScreen from './src/screens/DirectionsScreen';
import PermissionsScreen from './src/screens/PermissionsScreen';
import FavouritesScreen from './src/screens/FavouritesScreen';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{
        headerShown: true,
      }}
    >
      <Drawer.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Settings" component={SettingsMenu} />
      <Drawer.Screen name="Directions" component={DirectionsScreen} />
      <Drawer.Screen name="Favourites" component={FavouritesScreen} />
      <Drawer.Screen name="Permissions" component={PermissionsScreen} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
