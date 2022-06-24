import React from 'react';
import { TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import { getData } from '../utils/AsyncStorage.js';

const ReadiusTextInput = (props) => {
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    const isNum = /^\d+$/.test(text);
    const val = isNum ? parseInt(text) : 0;
    if (props.onRadiusChange) {
      props.onRadiusChange(val);
    }
  }, [text]);

  React.useEffect(() => {
    getData('radius').then((val) => setText(val));
  }, []);

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
