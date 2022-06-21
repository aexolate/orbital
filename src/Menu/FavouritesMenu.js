import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import { DatabaseManager } from '../utils/DatabaseManager';
import PropTypes from 'prop-types';
import { useIsFocused } from '@react-navigation/native';

const FavouritesMenu = ({ navigation }) => {
  const dbManager = DatabaseManager();
  const [items, setItems] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      updateItems();
    }
  }, [isFocused]);

  useEffect(() => {
    updateItems();
  }, []);

  //TODO: Ideally, this function should be in DatabaseManager.
  //Need to find a way to pass data from DBManager to this screen as the transaction is async.
  const updateItems = () => {
    dbManager.db.transaction((tx) => {
      tx.executeSql('SELECT * from favourites', [], (_, { rows }) => {
        setItems(JSON.parse(JSON.stringify(rows))._array);
      });
    });
  };

  //TODO: To properly define the type of a waypoint, additional mapping should not be required at this stage.
  const setAlarm = (waypoints) => {
    const wps = waypoints.map(wp => {
      return {
        coords: {latitude: wp.latitude, longitude: wp.longitude},
        title: 'Destination'
      };
    });
    navigation.navigate('Map', { requests: wps });
  };

  const removeAlarm = (id) => {
    dbManager.removeAlarm(id);
    updateItems();            //TODO: could be buggy - what if items are updated before the previous alarm is removed?
  };

  return (
    <View style={{ flex: 1}}>
      {/* <Text>Add alarms to your favourite by clicking the Favourite button after setting your alarm</Text> */}

      <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true}>
        {items?.map((data, index) => 
          (
            <View key={index} style={{backgroundColor:'white', padding:20}}>
              <Text>{data.id}</Text>
              <Text>{data.name}</Text>
              <Text>{data.waypoints}</Text>
              <Button mode='contained' color='#577399' onPress={() => setAlarm(JSON.parse(data.waypoints))}>Set Alarm</Button>
              <Button mode='contained' color='#FE5F55' onPress={() => removeAlarm(data.id)}>Remove</Button>
            </View>
          )
        )}
      </ScrollView>


      {/* <Text>Debugging Buttons - remove in release</Text>
      <Button onPress={() => dbManager.clearTable()}>clear</Button>
      <Button onPress={() => dbManager.printTable()}>print</Button>
      <Button onPress={test}>test</Button> */}

    </View>
  );
};
FavouritesMenu.propTypes = {
  navigation: PropTypes.any.isRequired,
};
export default FavouritesMenu;
