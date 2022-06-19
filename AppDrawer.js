import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapMenu from './src/Menu/MapMenu';
import SettingsMenu from './src/Menu/SettingsMenu';
import { getData, storeData } from './src/utils/AsyncStorage';
const Drawer = createDrawerNavigator();

const AppDrawer = () => {

  const [radius, setRadius] = useState(500);

  useEffect(() => {
    getData('radius').then(value => {
      if (value == null) {
        storeData('radius', 500);
        console.log('mounting stored data');
      } else {
        setRadius(value);
        console.log('else loop entered ', value);
        console.log('radius else loop ', radius);
      }
    })
  })

  return (
    <Drawer.Navigator useLegacyImplementation>
      <Drawer.Screen name="Map" 
                     component={MapMenu} />
      <Drawer.Screen name="Settings" 
                     component={SettingsMenu}
                     initialParams={{radius: radius}} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
