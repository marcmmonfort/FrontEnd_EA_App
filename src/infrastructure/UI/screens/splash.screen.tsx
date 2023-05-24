import React, { useEffect } from 'react';
import { ImageBackground, Image, View, StyleSheet, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    text_normal: {
        color: 'white',
        fontFamily: 'Arial',
        fontSize: 20,
        marginBottom: 10,
    },
  });

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('LoginScreen' as never);
    }, 3000);
  }, []);

  const imageUrl = require('../../../../assets/logo_lplan.png');

  return (
    <View style={styles.container}>
        <ImageBackground source={require('../../../../assets/background_5.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.text_normal}>Welcome to LPLAN!</Text>
                <Image source={imageUrl} style={styles.image} />
            </View>
        </ImageBackground>
    </View>
  );
}