import { getData, storeData } from './AsyncStorage';
import CONSTANTS from '../constants/Constants';

//The function returns the value of the key if present, else stores and returns the default value if absent
const getDataOrDefault = async (key: string, defaultValue: any): Promise<any> => {
  return getData(key).then((val) => {

    //console.log('[Debug] getDataOrDefault ' + key + ' ' + val);

    if (val == undefined) {
      storeData(key, defaultValue);
      return defaultValue;
    } else {
      return val;
    }
  });
};

//Default Key Values
const DEFAULT_USE_FAILSAFE = false;
const DEFAULT_BATTERY_THRESHOLD = 0.2; //Domain from [0, 1]
const DEFAULT_ALARM_VOLUME = 1; //Domain from [0, 1]
const DEFAULT_USE_VIBRATION = true;
const DEFAULT_ACTIVATION_RADIUS = 500; //in metres
const DEFAULT_ALARM_SONG = CONSTANTS.MUSIC.song1; //Must reference from /constants/Constants

export const getUseFailsafe = async (): Promise<boolean> => {
  return getDataOrDefault('USE_FAILSAFE', DEFAULT_USE_FAILSAFE);
};

export const storeUseFailSafe = (useFailSafe: boolean) => {
  storeData('USE_FAILSAFE', useFailSafe);
};

export const getBatteryThreshold = async (): Promise<number> => {
  return getDataOrDefault('BATTERY_THRESHOLD', DEFAULT_BATTERY_THRESHOLD).then((val) =>
    parseFloat(val),
  );
};

export const storeBatteryThreshold = (batteryThreshold: number) => {
  storeData('BATTERY_THRESHOLD', batteryThreshold);
};

export const getAlarmVolume = async (): Promise<number> => {
  return getDataOrDefault('ALARM_VOLUME', DEFAULT_ALARM_VOLUME).then((val) => parseFloat(val));
};

export const storeAlarmVolume = (alarmVolume: number) => {
  storeData('ALARM_VOLUME', alarmVolume);
};

export const getUseVibration = async (): Promise<boolean> => {
  return getDataOrDefault('USE_VIBRATION', DEFAULT_USE_VIBRATION);
};

export const storeUseVibration = (useVibration: boolean) => {
  storeData('USE_VIBRATION', useVibration);
};

export const getDefaultActivationRadius = async (): Promise<number> => {
  return getDataOrDefault('DEFAULT_ACTIVATION_RADIUS', DEFAULT_ACTIVATION_RADIUS).then((val) =>
    parseInt(val),
  );
};

export const storeDefaultActivationRadius = (activationRadius: number) => {
  storeData('DEFAULT_ACTIVATION_RADIUS', activationRadius);
};

export const getAlarmSong = async (): Promise<any> => {
  return getDataOrDefault('ALARM_SONG', DEFAULT_ALARM_SONG);
};

export const storeAlarmSong = (song: any) => {
  storeData('ALARM_SONG', song);
};
