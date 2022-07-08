import React from 'react';
import { Card, Button, Text, Colors } from 'react-native-paper';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const InfoBox = (props) => {
  return (
    <Card mode="outlined">
      <Card.Content>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
            {'Distance Remaining: ' + (props.distance / 1000).toFixed(2) + 'km'}
          </Text>

          <View style={{ flexDirection: 'row', paddingTop: 5 }}>
            <Button
              compact
              icon="star"
              color={Colors.yellow500}
              mode="contained"
              onPress={props.onSaveAlarm}
            >
              Favourite
            </Button>

            <View style={{ width: 10 }} />

            <Button
              compact
              icon="cancel"
              color={Colors.red900}
              mode="contained"
              onPress={props.onCancelAlarm}
            >
              Cancel
            </Button>
          </View>
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
