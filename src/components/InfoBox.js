import React from 'react';
import { Card, Button, Text } from 'react-native-paper';
import PropTypes from 'prop-types';

const InfoBox = (props) => {
  return (
    <Card>
      <Card.Content>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
          {'Distance Remaining: ' + (props.distance / 1000).toFixed(2) + ' km'}
        </Text>
        <Button icon="cancel" color="darkred" mode="contained" onPress={props.onCancelAlarm}>
          Cancel Alarm
        </Button>
      </Card.Content>
    </Card>
  );
};
InfoBox.propTypes = {
  distance: PropTypes.any.isRequired,
  onCancelAlarm: PropTypes.func.isRequired,
};
export default InfoBox;
