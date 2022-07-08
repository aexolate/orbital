import React from 'react';
import { Banner, Button } from 'react-native-paper';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import RadiusTextInput from '../components/RadiusTextInput.js';

const PromptBox = (props) => {
  //const [promptVisible, setPromptVisible] = React.useState(false);
  return (
    props.visible && (
      <View style={{ padding: 10 }}>
        <View style={{ alignItems: 'center', padding: 5, paddingBottom: 10 }}>
          <Text style={{ fontSize: 15 }}>Would you like to set this as your destination?</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: 160 }}>
            <RadiusTextInput onRadiusChange={props.onRadiusChange} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button mode="contained" color="green" onPress={props.onConfirmPrompt}>
              Confirm
            </Button>
            <View style={{ width: 5 }} />
            <Button mode="contained" color="darkred" onPress={props.onCancelPrompt}>
              Cancel
            </Button>
          </View>
        </View>
      </View>
    )
  );
};
PromptBox.propTypes = {
  onConfirmPrompt: PropTypes.func,
  onCancelPrompt: PropTypes.func,
  onRadiusChange: PropTypes.func,
  visible: PropTypes.bool,
};
export default PromptBox;
