import React from 'react';
import { Button, Divider } from 'react-native-paper';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import RadiusTextInput from '../components/RadiusTextInput';

const PromptBox = (props) => {
  //const [promptVisible, setPromptVisible] = React.useState(false);
  return (
    props.visible && (
      <View style={{ padding: 10 }}>
        <View style={{ alignItems: 'center', padding: 5, paddingBottom: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Would you like to set this as your destination?
          </Text>
        </View>

        <Divider />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: 155 }}>
            <RadiusTextInput onRadiusChange={props.onRadiusChange} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', top: 5 }}>
            <Button mode="contained" color="green" compact onPress={props.onConfirmPrompt}>
              Confirm
            </Button>
            <View style={{ width: 5 }} />
            <Button mode="contained" color="darkred" compact onPress={props.onCancelPrompt}>
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
