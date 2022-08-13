import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, Checkbox, Colors } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getData, storeData } from '../../utils/AsyncStorage';
import PropTypes from 'prop-types';
import { getAlarmSong, getBatteryThreshold, getDefaultActivationRadius, getUseFailsafe, getUseVibration, storeBatteryThreshold, storeDefaultActivationRadius, storeUseFailSafe, storeUseVibration } from '../../utils/KeysManager';

//activation radius is currently only set in confirm location, should change to on load screen
const SettingsMenu = ({ navigation }) => {
  const DEFAULT_RADIUS = 500;
  const DEFAULT_BATTERY = 0.2;
  const [radiusText, setRadiusText] = useState(''); //text for radius setting input
  const [radiusValue, setRadiusValue] = useState(DEFAULT_RADIUS); //radius that is displayed in app, also the current setting value
  const [batteryText, setBatteryText] = useState('');
  const [batteryValue, setBatteryValue] = useState(DEFAULT_BATTERY);
  const [songText, setSongText] = useState('');
  const isFocused = useIsFocused();
  const [checkedFailsafe, setCheckedFailsafe] = React.useState(false);
  const [checkedVibration, setCheckedVibration] = React.useState(false);

  useEffect(() => {
    //initial load for radius value setting
    // getData('radius').then((radius) => {
    //   setRadiusValue(radius == null ? DEFAULT_RADIUS : radius);
    // });
    getDefaultActivationRadius().then((rad) => {
      setRadiusValue(rad);
    });

    //initial load for battery threshold setting
    // getData('batteryThreshold').then((batteryThreshold) => {
    //   setBatteryValue(batteryThreshold == null ? DEFAULT_BATTERY : parseInt(batteryThreshold));
    // });

    getBatteryThreshold().then(bat => {
      setBatteryValue(bat);
    });

    //initial load for failsafe setting
    // getData('USE_FAILSAFE').then((useFailsafe) => {
    //   if (useFailsafe == undefined) {
    //     setCheckedFailsafe(false);
    //   } else {
    //     setCheckedFailsafe(useFailsafe);
    //   }
    // });

    getUseFailsafe().then(useFailsafe => {
      setCheckedFailsafe(useFailsafe);
    });

    //initial load for vibration setting
    // getData('vibration').then((vibration) => {
    //   if (vibration == undefined) {
    //     setCheckedVibration(true);
    //   } else {
    //     setCheckedVibration(vibration);
    //   }
    // });

    getUseVibration().then(useVibration => {
      setCheckedVibration(useVibration);
    });

  }, []);

  useEffect(() => {
    if (isFocused) {
      // getData('song').then((song) => {
      //   setSongText(song.name);
      // });

      getAlarmSong().then(song => {
        setSongText(song.name);
      });
    }
  }, [isFocused]);

  const SettingsRadiusButton = (props) => {
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
            storeDefaultActivationRadius(parseInt(radiusText));
            //storeData(props.keyValue, radiusText);
            setRadiusValue(parseInt(radiusText));
            setRadiusText('');
          }
        }}
      >
        Set Radius
      </Button>
    );
  };

  const SettingsBatteryButton = (props) => {
    return (
      <Button
        mode="contained"
        color={Colors.blue800}
        icon="battery-alert"
        onPress={() => {
          const isNum = /^\d+$/.test(batteryText);
          if (!isNum || !(parseInt(batteryText) > 0) || !(parseInt(batteryText) < 100)) {
            alert('Invalid battery percentage, must be whole number between 0% and 100%');
          } else {
            const batPercentage = parseInt(batteryText) / 100;
            //storeData(props.keyValue, batteryText);
            storeBatteryThreshold(batPercentage);
            setBatteryValue(batPercentage);
            setBatteryText('');
          }
        }}
      >
        Set Battery Threshold
      </Button>
    );
  };

  SettingsRadiusButton.propTypes = {
    keyValue: PropTypes.string.isRequired,
  };

  SettingsBatteryButton.propTypes = {
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
        <SettingsRadiusButton keyValue={'radius'} />
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
        <Text style={styles.text}>Enable Vibration </Text>
        <Checkbox
          status={checkedVibration ? 'checked' : 'unchecked'}
          onPress={() => {
            //storeData('vibration', !checkedVibration);
            storeUseVibration(!checkedVibration);
            setCheckedVibration(!checkedVibration);
          }}
        />
      </View>
      <Text>
        * Vibration will be active when any audio is played, including alarms and preview audio
      </Text>

      <View style={styles.separator} />

      <View>
        <Text style={styles.text}>Failsafe Battery Threshold: {batteryValue * 100} %</Text>
        <TextInput
          placeholder="Enter Battery Threshold Value"
          value={batteryText}
          onChangeText={setBatteryText}
          keyboardType="numeric"
          dense
        />
        <SettingsBatteryButton keyValue={'batteryThreshold'} />
      </View>

      <View style={styles.separator} />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.text}>Enable Failsafe </Text>
        <Checkbox
          status={checkedFailsafe ? 'checked' : 'unchecked'}
          onPress={() => {
            //storeData('USE_FAILSAFE', !checkedFailsafe);
            storeUseFailSafe(!checkedFailsafe);
            setCheckedFailsafe(!checkedFailsafe);
          }}
        />
      </View>
      <Text>
        * Failsafe will activate alarm when battery falls below set battery threshold value or when
        location is lost
      </Text>
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
