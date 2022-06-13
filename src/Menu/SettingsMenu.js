import React from 'react';
import { View } from 'react-native';
import { Provider as PaperProvider, Button, Card, Text, Banner, TextInput } from 'react-native-paper';

const SettingsMenu = (navigation) => {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        label="Enter Activation Radius"
    />
      <Button
        mode='contained'
      >
        confirm
      </Button>
    </View>
  );
};

export default SettingsMenu;
