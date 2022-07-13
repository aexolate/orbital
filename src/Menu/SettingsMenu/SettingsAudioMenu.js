import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import MusicBox from '../../components/MusicBox';
import CONSTANTS from '../../Constants/constants.js';
import { useIsFocused } from '@react-navigation/native';

const SettingsAudioMenu = () => {

    const [ audioText, setAudioText ] = useState('');

    return (
        <View>
            <MusicBox song={CONSTANTS.MUSIC.song1}></MusicBox>
            <MusicBox song={CONSTANTS.MUSIC.song2}></MusicBox>
        </View>
    )
}

export default SettingsAudioMenu;