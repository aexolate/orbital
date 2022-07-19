import React from 'react';
import { Card, Button } from 'react-native-paper';
import PropTypes from 'prop-types';

const AlarmBox = (props) => {
  return (
    <Card>
      <Card.Title title="Destination Reached" />
      <Card.Content>
        <Button icon="alarm-off" mode="contained" onPress={props.onDismissAlarm}>
          Dismiss Alarm
        </Button>
      </Card.Content>
    </Card>
  );
};
AlarmBox.propTypes = {
  onDismissAlarm: PropTypes.func,
};
export default AlarmBox;
