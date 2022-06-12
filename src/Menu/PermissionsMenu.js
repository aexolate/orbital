import * as Location from 'expo-location';
import { Linking, StyleSheet, View, BackHandler } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';

export default function PermissionsMenu() {
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

        <View style={styles.block}>
          <Button icon="cancel" color="red" mode="contained" onPress={() => BackHandler.exitApp()}>
            Decline
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  block: {
    marginVertical: 25,
  },
  button: {
    mode: 'contained',
  },
});
