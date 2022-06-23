import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('stored ' + key + ': ' + value);
  } catch (e) {
    console.log('error storing');
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('returned ' + key + ': ' + JSON.parse(value));
      return JSON.parse(value);
    }
  } catch (e) {
    console.log('error getting value');
  }
};
