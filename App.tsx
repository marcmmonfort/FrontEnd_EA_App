import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/infrastructure/UI/screens/login.screen';
import RegisterScreen from './src/infrastructure/UI/screens/Register/register.screen';
import HomeScreen from './src/infrastructure/UI/screens/home.screen';
import ScreenRegisterA from './src/infrastructure/UI/screens/Register/register.screen';
import ScreenRegisterFinal from './src/infrastructure/UI/screens/Register/registerFinal.screen';
import ScreenRegisterB from './src/infrastructure/UI/screens/Register/register2.screen';
import ScreenRegisterC from './src/infrastructure/UI/screens/Register/register3.screen';
import ScreenRegisterD from './src/infrastructure/UI/screens/Register/register4.screen';
import ScreenRegisterE from './src/infrastructure/UI/screens/Register/register5.screen';

const Stack=createStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator>
      
      <Stack.Screen name='Login' options={{headerShown: false}} component={LoginScreen} />
      <Stack.Screen name="ScreenRegisterA" component={ScreenRegisterA} />
      <Stack.Screen name="ScreenRegisterB" component={ScreenRegisterB} />
      <Stack.Screen name="ScreenRegisterC" component={ScreenRegisterC} />
      <Stack.Screen name="ScreenRegisterD" component={ScreenRegisterD} />
      <Stack.Screen name="ScreenRegisterE" component={ScreenRegisterE} />


      

      <Stack.Screen name="ScreenRegisterFinal" component={ScreenRegisterFinal} />
    
      <Stack.Screen name="Home" options={{title: 'LPlan'}} component={HomeScreen}/>
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
