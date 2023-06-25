import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ChatA from "./src/infrastructure/UI/screens/Chat/chatA.screen";
import ChatC from "./src/infrastructure/UI/screens/Chat/chatC.screen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ChatA"
          options={{ headerShown: false }}
          component={ChatA}
        />
        <Stack.Screen
          name="ChatC"
          options={{ headerShown: false }}
          component={ChatC}
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
