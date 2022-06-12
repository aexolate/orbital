import React from 'react';
import { Snackbar } from 'react-native-paper';

const SnackbarHint = () => {
  const [hintVisible, setHintVisible] = React.useState(true);
  const onDismissSnackBar = () => setHintVisible(false);

  return (
    <Snackbar
      visible={hintVisible}
      onDismiss={onDismissSnackBar}
      action={{ label: 'Dismiss' }}
      duration={2500}
    >
      Search the address or long-press on the map to set the alarm
    </Snackbar>
  );
};
export default SnackbarHint;
