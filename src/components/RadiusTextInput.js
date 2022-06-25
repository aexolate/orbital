import React from 'react';
import { TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import { getData } from '../utils/AsyncStorage.js';
import { useIsFocused } from '@react-navigation/native';

const ReadiusTextInput = (props) => {
  const [text, setText] = React.useState('');
  const isFocused = useIsFocused();
  const DEFAULT_RADIUS = 500;

  React.useEffect(() => {
    const isNum = /^\d+$/.test(text);
    const val = isNum ? parseInt(text) : 0;
    if (props.onRadiusChange) {
      props.onRadiusChange(val);
    }
  }, [text]);

  const updateRadius = () => {
    getData('radius').then((val) => {
      setText(val == null ? DEFAULT_RADIUS : val.toString());
    });
  };

  React.useEffect(() => {
    if (isFocused) {
      updateRadius();
    }
  }, [isFocused]);

  return (
    <TextInput
      dense
      mode="outlined"
      label="Activation Radius"
      value={text}
      onChangeText={(txt) => setText(txt)}
      right={<TextInput.Affix text="meters" />}
      keyboardType="numeric"
    />
  );
};
ReadiusTextInput.propTypes = {
  onRadiusChange: PropTypes.func,
};

export default ReadiusTextInput;
