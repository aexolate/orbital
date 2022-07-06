import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { getData, storeData } from '../../utils/AsyncStorage';
import PropTypes from 'prop-types';
import * as MediaLibrary from 'expo-media-library';


const SettingsAudioMenu = () => {

    const [audioFiles, setAudioFiles] = useState([]);

    useEffect(() => {
        getPermission();
    }, []);

    //function for asking permissions to access audio files
    const getPermission = async () => {
        const permission = await MediaLibrary.getPermissionsAsync(); //get current permission status
        console.log(permission);

        if (!permission.granted && permission.canAskAgain) {
            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync(); //ask permission if not allowed but can ask again
            if (status === 'denied' && canAskAgain) {
                getPermission(); //ask again
            }
            if (status === 'granted') {
                getAudioFiles(); //granted
            }
            if (status === 'denied' && !canAskAgain) { //denied
                //TO DO
            }
        }

        if (!permission.granted && !permission.canAskAgain) {
            //TO DO
        }

        getAudioFiles();
    };

    //function to get audio files
    const getAudioFiles = async () => {
        let media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
        console.log(media);
        setAudioFiles(media.assets);
    };

    return (
        <View><FlatList
            data={audioFiles}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <Text style={styles.audioTitle}>{item.filename}</Text>
            )}
        /></View>
    )
}

export default SettingsAudioMenu;