import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { getData, storeData } from '../utils/AsyncStorage';
import PropTypes from 'prop-types';

//activation radius is currently only set in confirm location, should change to on load screen
const SettingsMenu = () => {
  const [radiusText, setRadiusText] = useState(''); //text for radius setting input
  const [radiusValue, setRadiusValue] = useState(0); //radius that is displayed in app, also the current setting value

  useEffect(() => {
    getData('radius').then((radius) => setRadiusValue(radius));
  }, []);

  const SettingsButton = (props) => {
    return (
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => {
          if (radiusText == '') {
            alert('No value keyed in!');
          } else {
            storeData(props.keyValue, radiusText);
            setRadiusValue(radiusText);
            setRadiusText('');
          }
        }}
      >
        confirm
      </Button>
    );
  };
  SettingsButton.propTypes = {
    keyValue: PropTypes.string.isRequired,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Radius: {radiusValue}</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter Activation Radius"
        value={radiusText}
        onChangeText={setRadiusText}
        keyboardType="numeric"
      />
      <SettingsButton keyValue={'radius'} />
    </View>
  );
};

export default SettingsMenu;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    top: 10,
    left: 10,
    alignSelf: 'flex-start',
  },
  textInput: {
    height: 50,
    width: 400,
    top: 18,
  },
  button: {
    height: 40,
    width: 400,
    top: 25,
  },
});
