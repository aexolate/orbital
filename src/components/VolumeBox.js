import React, { useEffect, useRef, useState } from 'react';
import { Alert, View, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Button, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { storeData } from '../utils/AsyncStorage';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';

const VolumeBox = () => {
  return <View style={styles.container}></View>;
};

export default VolumeBox;

const styles = StyleSheet.create({
  container: {},
});
