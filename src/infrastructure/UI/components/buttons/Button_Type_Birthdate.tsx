import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ButtonGradientProps } from './Types';

const ButtonGradientBirthdate = ({ onPress, containerStyle, buttonStyle, textStyle }: ButtonGradientProps) => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      <LinearGradient
        colors={['#66fcf1', '#66fcf1']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.button, buttonStyle]}
      >
        <Text style={[styles.text, textStyle]}>BIRTHDATE</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    alignItems: 'center',
    marginTop: 100,
    
  },
  button: {
    marginTop: -44,
    marginLeft:0,
    marginRight:0,
    height: 60,
    width: 120,
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'black',
  },
});

export default ButtonGradientBirthdate;
