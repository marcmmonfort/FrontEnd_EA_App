import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/infrastructure/UI/screens/login/login.screen';
import RegisterScreen from './src/infrastructure/UI/screens/login/register.screen';
const Stack=createStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name='Login' options={{headerShown: false}} component={LoginScreen} />
      <Stack.Screen name='Register' options={{headerShown: false}} component={RegisterScreen} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
