import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { getData, storeData } from '../utils/AsyncStorage';
import PropTypes from 'prop-types';

//activation radius is currently only set in confirm location, should change to on load screen
const SettingsMenu = () => {
  const [radiusText, setRadiusText] = useState(0); //text for radius setting input
  const [radiusValue, setRadiusValue] = useState(0); //radius that is displayed in app, also the current setting value

  useEffect(() => {
    getData('radius').then((radius) => setRadiusValue(radius));
  });

  const SettingsButton = (props) => {
    return (
      <Button
        style={styles.Button}
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
    keyValue: PropTypes.any.isRequired,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Radius: {radiusValue}</Text>
      <SettingsButton keyValue={'radius'} />
      <TextInput
        style={styles.textInput}
        placeholder="Enter Activation Radius"
        value={radiusText}
        onChangeText={setRadiusText}
        keyboardType="numeric"
      />
    </View>
  );
};

export default SettingsMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    flex: 1,
  },
  textInput: {
    flex: 1,
  },
  button: {
    flex: 1,
  },
});
