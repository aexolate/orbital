import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getData, storeData } from '../../utils/AsyncStorage';
import PropTypes from 'prop-types';

//activation radius is currently only set in confirm location, should change to on load screen
const SettingsMenu = ({ navigation }) => {
  const DEFAULT_RADIUS = 500;
  const [radiusText, setRadiusText] = useState(''); //text for radius setting input
  const [radiusValue, setRadiusValue] = useState(DEFAULT_RADIUS); //radius that is displayed in app, also the current setting value
  const [songText, setSongText] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    getData('radius').then((radius) => {
      setRadiusValue(radius == null ? DEFAULT_RADIUS : radius);
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      getData('song').then((song) => {
        setSongText(song.name);
      });
    }
  }, [isFocused]);

  const SettingsButton = (props) => {
    return (
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => {
          const isNum = /^\d+$/.test(radiusText);
          if (!isNum || !(parseInt(radiusText) > 0)) {
            alert('Invalid Radius');
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
      <Text style={styles.radiusText}>Default Activation Radius: {radiusValue} meters</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter Activation Radius"
        value={radiusText}
        onChangeText={setRadiusText}
        keyboardType="numeric"
      />
      <SettingsButton keyValue={'radius'} />
      <Text style={styles.audioText}>Alarm Sound: {songText}</Text>
      <Button
        style={styles.audioButton}
        mode="contained"
        onPress={() => {
          navigation.navigate('Audio');
        }}
      >
        Set Audio
      </Button>
    </View>
  );
};

export default SettingsMenu;

SettingsMenu.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  radiusText: {
    fontSize: 19,
    top: 10,
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
  audioText: {
    fontSize: 19,
    top: 35,
    justifyContent: 'space-between',
  },
  audioButton: {
    height: 40,
    width: 400,
    top: 50,
  },
});
