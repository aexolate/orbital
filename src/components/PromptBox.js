import React from 'react';
import { Banner } from 'react-native-paper';
import PropTypes from 'prop-types';

const PromptBox = (props) => {
  //const [promptVisible, setPromptVisible] = React.useState(false);
  return (
    <Banner
      visible={props.visible}
      actions={[
        {
          label: 'Set Destination',
          onPress: props.onConfirmPrompt,
        },
        {
          label: 'Cancel',
          onPress: props.onCancelPrompt,
        },
      ]}
    >
      Would you like to set this as your destination?
    </Banner>
  );
};
PromptBox.propTypes = {
  onConfirmPrompt: PropTypes.func,
  onCancelPrompt: PropTypes.func,
  visible: PropTypes.bool,
};
export default PromptBox;
