import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Button, Card, Text, Banner, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(JSON.stringify(key), value);
      console.log('stored ' + key + ': ' + value);
    } catch (e) {
      console.log('error storing');
    }
  }

export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(JSON.stringify(key))
      if(value !== null) {
        console.log('returned ' + key + ': ' + value);
        return value;
      }
    } catch(e) {
      console.log('error getting value');
    }
  }