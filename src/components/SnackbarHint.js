import { View } from 'react-native';
import React, { useState } from 'react';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';

const SnackbarHint = () => {
  const [hintVisible, setHintVisible] = React.useState(true);
  const onDismissSnackBar = () => setHintVisible(false);

  return (
    <View>
      <Snackbar visible={hintVisible} onDismiss={onDismissSnackBar} action={{ label: 'Dismiss' }}>
        Search the address or long-press on the map to set the alarm
      </Snackbar>
    </View>
  );
};
export default SnackbarHint;
