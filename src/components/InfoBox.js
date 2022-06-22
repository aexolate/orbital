import React from 'react';
import { Card, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const InfoBox = (props) => {
  return (
    <Card>
      <Card.Content>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
            {'Distance Remaining: \n' + (props.distance / 1000).toFixed(2) + ' km'}
          </Text>
          <Button style={{alignContent: 'center', justifyContent: 'center'}} icon="cancel" color="darkred" mode="contained" onPress={props.onCancelAlarm}>
            Cancel
          </Button>
          <Button style={{alignContent: 'center', justifyContent: 'center'}} icon="star" color="yellow" mode="contained" onPress={props.onSaveAlarm}>
            Save
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};
InfoBox.propTypes = {
  distance: PropTypes.any.isRequired,
  onCancelAlarm: PropTypes.func.isRequired,
  onSaveAlarm: PropTypes.func.isRequired,
};
export default InfoBox;
