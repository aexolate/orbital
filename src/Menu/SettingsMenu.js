import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Button, Card, Text, Banner, TextInput } from 'react-native-paper';
import { storeData } from '../utils/AsyncStorage';

//activation radius is currently only set in confirm location, should change to on load screen
const SettingsMenu = (navigation) => {

  const [radiusText, setRadiusText] = useState(500);

 /* const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('radius', value);
      console.log('stored radius');
    } catch (e) {
      console.log('error storing');
    }
  }*/

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Enter Activation Radius"
        value={radiusText}
        onChangeText={setRadiusText}
    />
      <Button
        style={styles.Button}
        mode='contained'
        onPress={() => {
          storeData('radius', radiusText);
        }}
      >
        confirm
      </Button>
      <Text
        style={styles.text}
        
      >
        {radiusText}
      </Text>
    </View>
  );
};

export default SettingsMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    flex: 2,
  },
  textInput: {
    flex: 1,
  },
  button: {
    flex: 1,
  },
})
