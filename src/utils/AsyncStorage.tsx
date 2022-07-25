import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('stored ' + key + ': ' + value);
  } catch (e) {
    console.log('error storing:' + e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log('get value: ' + value);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.log('error getting value:' + e);
  }
};
