import React, { useEffect } from 'react';
import { ImageBackground, Image, View, StyleSheet, Text, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {

  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#000000",
    },
    image: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
    },
    text_normal: {
        color: 'white',
        fontSize: 20,
        marginBottom: 10,
    },
  });

  useEffect(() => {
    setTimeout(() => {
        const checkToken = async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (token) {
                navigation.navigate('HomeScreen' as never);
              } else {
                navigation.navigate('LoginScreen' as never);
              }
            } catch (error) {
              console.log('Error al obtener el token:', error);
            }
          };
        checkToken();
    }, 3000);
  }, []);

  const imageUrl = require('../../../../assets/logo_lplan.png');

  return (
    <View style={styles.container}>
        <View style={styles.container}>
            <Text style={styles.text_normal}>Welcome to LPLAN!</Text>
            <Image source={imageUrl} style={styles.image} />
        </View>
    </View>
  );
}