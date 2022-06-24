import React from 'react';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';

const MenuButton = (props) => {
  return (
    <Button icon="menu" color="white" mode="contained" onPress={() => props?.onPress}>
      Menu
    </Button>
  );
};
MenuButton.propTypes = {
  onPress: PropTypes.func,
};
export default MenuButton;
