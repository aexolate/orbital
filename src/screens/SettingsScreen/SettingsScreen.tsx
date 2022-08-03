import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, Checkbox, Colors } from 'react-native-paper';
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
  const [checkedFailsafe, setCheckedFailsafe] = React.useState(false);
  const [checkedVibration, setCheckedVibration] = React.useState(false);

  useEffect(() => {

    //initial load for radius value setting
    getData('radius').then((radius) => {
      setRadiusValue(radius == null ? DEFAULT_RADIUS : radius);
    });

    //initial load for failsafe setting
    getData('USE_FAILSAFE').then((useFailsafe) => {
      if (useFailsafe == undefined) {
        setCheckedFailsafe(false);
      } else {
        setCheckedFailsafe(useFailsafe);
      }
    });

    //initial load for vibration setting
    getData('vibration').then((vibration) => {
      if (vibration == undefined) {
        setCheckedVibration(false);
      } else {
        setCheckedVibration(vibration);
      }
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
        mode="contained"
        color={Colors.blue800}
        icon="map-marker-radius-outline"
        onPress={() => {
          const isNum = /^\d+$/.test(radiusText);
          if (!isNum || !(parseInt(radiusText) > 0)) {
            alert('Invalid Radius');
          } else {
            storeData(props.keyValue, radiusText);
            setRadiusValue(parseInt(radiusText));
            setRadiusText('');
          }
        }}
      >
        Set Radius
      </Button>
    );
  };
  SettingsButton.propTypes = {
    keyValue: PropTypes.string.isRequired,
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Default Activation Radius: {radiusValue} meters</Text>
        <TextInput
          placeholder="Enter Activation Radius"
          value={radiusText}
          onChangeText={setRadiusText}
          keyboardType="numeric"
          dense
        />
        <SettingsButton keyValue={'radius'} />
      </View>

      <View style={styles.separator} />

      <View>
        <Text style={styles.text}>Alarm Sound: {songText}</Text>
        <Button
          mode="contained"
          icon="volume-medium"
          color={Colors.blue800}
          onPress={() => {
            navigation.navigate('Audio');
          }}
        >
          Audio Menu
        </Button>
      </View>

      <View style={styles.separator} />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.text}>Enable Failsafe </Text>
        <Checkbox
          status={checkedFailsafe ? 'checked' : 'unchecked'}
          onPress={() => {
            storeData('USE_FAILSAFE', !checkedFailsafe);
            setCheckedFailsafe(!checkedFailsafe);
          }}
        />
      </View>
      <Text>
        * Failsafe will activate alarm when battery falls below 20% or GPS connectivity is not
        working for prolonged period
      </Text>

      <View style={styles.separator} />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.text}>Enable Vibration </Text>
        <Checkbox
          status={checkedVibration ? 'checked' : 'unchecked'}
          onPress={() => {
            storeData('vibration', !checkedVibration);
            setCheckedVibration(!checkedVibration);
          }}
        />
      </View>

    </View>
  );
};

export default SettingsMenu;

SettingsMenu.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  separator: {
    height: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    height: 40,
    width: 400,
    top: 25,
  },
  audioButton: {
    height: 40,
    width: 400,
    top: 50,
  },
});
