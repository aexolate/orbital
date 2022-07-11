import * as Location from 'expo-location';
import { Linking, StyleSheet, View } from 'react-native';
import React from 'react';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import PropTypes from 'prop-types';

export default function PermissionsMenu({ navigation }) {
  const [foreground, requestForeground] = Location.useForegroundPermissions();
  const [background, requestBackground] = Location.useBackgroundPermissions();

  return (
    <PaperProvider>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Location Permissions Request</Text>
        <Text>
          The application requires Location permission including background location to continue
          tracking your location even when the app is not in the foreground. Your location will only
          be tracked when the alarm is active.
        </Text>

        <View>
          <View style={styles.block}>
            <Text>Foreground Permission: {foreground?.status || 'pending'}</Text>

            {foreground && !foreground.granted && foreground.canAskAgain && (
              <Button color="orange" mode="contained" onPress={requestForeground}>
                Grant Permission
              </Button>
            )}

            {foreground && !foreground.granted && !foreground.canAskAgain && (
              <Button
                color="orange"
                mode="contained"
                onPress={() =>
                  requestForeground().then((p) => !p.granted && Linking.openSettings())
                }
              >
                Grant permission through settings
              </Button>
            )}
          </View>

          <View style={styles.block}>
            <Text>Background Permission: {background?.status || 'pending'}</Text>

            {!foreground?.granted && <Text>Grant foreground location permission first</Text>}

            {foreground?.granted && background && !background.granted && background.canAskAgain && (
              <Button color="orange" mode="contained" onPress={requestBackground}>
                Grant permission
              </Button>
            )}

            {foreground?.granted && background && !background.granted && !background.canAskAgain && (
              <Button
                color="orange"
                mode="contained"
                onPress={() =>
                  requestBackground().then((p) => !p.granted && Linking.openSettings())
                }
              >
                Grant permission through settings
              </Button>
            )}
          </View>
        </View>

        {background?.granted && (
          <View style={styles.block}>
            <Button color="green" mode="contained" onPress={() => navigation.navigate('Map')}>
              Return To Map
            </Button>
          </View>
        )}
      </View>
    </PaperProvider>
  );
}
PermissionsMenu.propTypes = {
  route: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
  block: {
    marginVertical: 25,
  },
});
