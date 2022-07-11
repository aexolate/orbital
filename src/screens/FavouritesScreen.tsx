import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, Divider } from 'react-native-paper';
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
    const wps = waypoints.map((wp) => {
      return {
        coords: { latitude: wp.latitude, longitude: wp.longitude },
        title: 'Destination',
      };
    });
    navigation.navigate('Map', { requests: wps });
  };

  const removeAlarm = (id) => {
    dbManager.removeAlarm(id);
    updateItems(); //TODO: could be buggy - what if items are updated before the previous alarm is removed?
  };

  return (
    <View style={{ flex: 1 }}>
      {items?.length == 0 && (
        <View style={{ padding: 25 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            Add alarms to your favourites by clicking the Favourite button after setting your alarm
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true}>
        {items?.map((data, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.alarmName}>{data.name}</Text>
            <Divider></Divider>
            <Text>{JSON.parse(data.waypoints).length} Waypoints</Text>

            <View style={{ flexDirection: 'row' }}>
              <Button
                mode="contained"
                color="green"
                icon="map-check"
                onPress={() => setAlarm(JSON.parse(data.waypoints))}
              >
                Set Alarm
              </Button>
              <Button
                mode="contained"
                icon="delete"
                color="darkred"
                onPress={() => removeAlarm(data.id)}
              >
                Remove
              </Button>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
FavouritesMenu.propTypes = {
  navigation: PropTypes.any.isRequired,
};
export default FavouritesMenu;

const styles = StyleSheet.create({
  alarmName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 1,
  },
});
