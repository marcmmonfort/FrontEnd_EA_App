import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button, View, Text, Linking } from "react-native";
import { StyleSheet } from "react-native";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [token, setToken] = useState<any>();
  const [request, response, promptAsync] = Google.useAuthRequest({
    //webClientId: '100520602957-meq5chqk8uf7atnhtdg37njbmabi1mve.apps.googleusercontent.com',
    //androidClientId: '100520602957-ugehqbik8apu98g0q1ken51hfa40mnc0.apps.googleusercontent.com',
    //expoClientId: 'd46b599c-8a72-4f85-a9af-9ebf25c241b3',
    expoClientId:'100520602957-meq5chqk8uf7atnhtdg37njbmabi1mve.apps.googleusercontent.com',
    scopes: ["profile", "email"],
      redirectUri: makeRedirectUri({
        useProxy:true,
        native:`https://auth.expo.io/@oscarr.bd/my-project`,
        scheme: 'my-project'
        
      }),
  });

  useEffect(() => {
    console.log("Hola");
    if (response?.type === "success") {
      console.log("Posible success");
      setToken(response.authentication?.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      console.log("estooy en el try")
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
       
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response: " + response);
      const user = await response.json();
      console.log(JSON.stringify(user));
      setUserInfo(user);
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <View style={styles.container}>
      {userInfo === null ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <Text style={styles.text}>{userInfo.name}</Text>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
