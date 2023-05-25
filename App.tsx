import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./src/infrastructure/UI/screens/login.screen";
import RegisterScreen from "./src/infrastructure/UI/screens/Register/register.screen";
import HomeScreen from "./src/infrastructure/UI/screens/home.screen";
import ScreenRegisterA from "./src/infrastructure/UI/screens/Register/register.screen";
import ScreenRegisterFinal from "./src/infrastructure/UI/screens/Register/registerFinal.screen";
import ScreenRegisterB from "./src/infrastructure/UI/screens/Register/register2.screen";
import ScreenRegisterC from "./src/infrastructure/UI/screens/Register/register3.screen";
import ScreenRegisterD from "./src/infrastructure/UI/screens/Register/register4.screen";
import ScreenRegisterE from "./src/infrastructure/UI/screens/Register/register5.screen";
import ProfileScreen from "./src/infrastructure/UI/screens/profile.screen";
import EditUserScreen from "./src/infrastructure/UI/screens/edit.user.screen";
import SplashScreen from "./src/infrastructure/UI/screens/splash.screen";
import ScreenPublicationUpB from "./src/infrastructure/UI/screens/Publication/publicationUpB.screen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Splash"
          options={{ headerShown: false }}
          component={SplashScreen}
        />    
        <Stack.Screen
          name="LoginScreen"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="ScreenRegisterA"
          options={{ headerShown: false }}
          component={ScreenRegisterA}
        />
        <Stack.Screen
          name="ScreenRegisterB"
          options={{ headerShown: false }}
          component={ScreenRegisterB}
        />
        <Stack.Screen
          name="ScreenRegisterC"
          options={{ headerShown: false }}
          component={ScreenRegisterC}
        />
        <Stack.Screen
          name="ScreenRegisterD"
          options={{ headerShown: false }}
          component={ScreenRegisterD}
        />
        <Stack.Screen
          name="ScreenRegisterE"
          options={{ headerShown: false }}
          component={ScreenRegisterE}
        />
        <Stack.Screen
          name="ScreenRegisterFinal"
          options={{ headerShown: false }}
          component={ScreenRegisterFinal}
        />
        <Stack.Screen
          name="HomeScreen"
          options={{ title: "LPlan", headerShown: false }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Register"
          options={{ headerShown: false }}
          component={RegisterScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
