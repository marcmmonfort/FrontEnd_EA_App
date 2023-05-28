import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";

export default function CalendarEventsScreen() {
  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View>
      <Text></Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
