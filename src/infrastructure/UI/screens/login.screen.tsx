import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Svg, { Defs, Path, Pattern, Use, Image } from "react-native-svg";
import MainContainer from "../components/containers/Main";
import Title from "../components/texts/Title";
import SubTitle from "../components/texts/Subtitle";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import ButtonGradient from "../components/buttons/ButtonGradient";
import { AuthEntity } from "../../../domain/user/user.entity";
import { SessionService } from "../../services/user/session.service";
import NormalText from "../components/texts/NormalText";
import { Platform, StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import Register from "../components/texts/Register";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import '../../../../assets/fonts/Rafaella.ttf';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
  });
}

export default function LoginScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const navigation = useNavigation();

  const customFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella-Regular',
  });

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const styles = StyleSheet.create({
    text_normal: {
      color: 'white',
      fontFamily: customFont,
      fontSize: 20,
      marginBottom: 10,
    },
  });

  if (!fontsLoaded) {
    // Muestra un componente de carga mientras se cargan las fuentes
    return null;
  }

  return (
    <MainContainer>
      <Title style={styles.text_normal}>Lplan</Title>
      <SubTitle>Let's Go!</SubTitle>
      <StyledTextInputs
        placeholder="mail"
        value={inputEmail}
        onChangeText={setInputEmail}
      />
      <StyledTextInputs
        placeholder="Password"
        value={inputPassword}
        onChangeText={setInputPassword}
        secureTextEntry={true}
      />
      <ButtonGradient
        onPress={() => {
          const formData: AuthEntity = {
            mailUser: inputEmail,
            passwordUser: inputPassword,
          };

          console.log("formData " + formData.mailUser);
          console.log("formData " + formData.passwordUser);
          SessionService.login(formData)
            .then((response) => {
              console.log(response);
              if (response.status === 200) {
                console.log(response.data);
                SessionService.setCurrentUser(
                  JSON.stringify(response.data.user.uuid),
                  JSON.stringify(response.data.token)
                );
                console.log("_id" + JSON.stringify(response.data.user.uuid));
                console.log("token" + JSON.stringify(response.data.token));
                console.log("Login Succesfull!");

                navigation.navigate('HomeScreen' as never);
              }
            })
            .catch((error) => {
              console.error("error: " + error);
              console.log("error.response: " + error.response);
              switch (error.response.status) {
                case 403:
                  // Poner aquí el alert ...
                  console.log("Incorrect Password");

                  break;
                case 404:
                  // Poner aquí el alert ...
                  console.log("User does not exist");
                  navigation.navigate("Register" as never);
                  break;
              }
            });
        }}
      />
      <NormalText>Aren't you still an @lplan member?</NormalText>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register" as never)}
      >
        <Register>Sign Up!</Register>
      </TouchableOpacity>
      <StatusBar />
    </MainContainer>
  );
}

/*
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Svg, { Defs, Path, Pattern, Use, Image } from "react-native-svg";
import MainContainer from "../components/containers/Main";
import Title from "../components/texts/Title";
import SubTitle from "../components/texts/Subtitle";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import ButtonGradient from "../components/buttons/ButtonGradient";
import { AuthEntity } from "../../../domain/user/user.entity";
import { SessionService } from "../../services/user/session.service";
import NormalText from "../components/texts/NormalText";
import { Platform, StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import Register from "../components/texts/Register";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
  });
}

export default function LoginScreen() {
  useEffect(() => {
    loadFonts();
  }, []);

  const navigation = useNavigation();

  const customFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella-Regular',
  });

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const styles = StyleSheet.create({
    text_normal: {
      color: 'white',
      fontFamily: customFont,
      fontSize: 20,
      marginBottom: 10,
    },
  });

  return (
    <MainContainer>
      <Title style={styles.text_normal}>Lplan</Title>
      <SubTitle>Let's Go!</SubTitle>
      <StyledTextInputs
        placeholder="mail"
        value={inputEmail}
        onChangeText={setInputEmail}
      />
      <StyledTextInputs
        placeholder="Password"
        value={inputPassword}
        onChangeText={setInputPassword}
        secureTextEntry={true}
      />
      <ButtonGradient
        onPress={() => {
          const formData: AuthEntity = {
            mailUser: inputEmail,
            passwordUser: inputPassword,
          };

          console.log("formData " + formData.mailUser);
          console.log("formData " + formData.passwordUser);
          SessionService.login(formData)
            .then((response) => {
              console.log(response);
              if (response.status === 200) {
                console.log(response.data);
                SessionService.setCurrentUser(
                  JSON.stringify(response.data.user.uuid),
                  JSON.stringify(response.data.token)
                );
                console.log("_id" + JSON.stringify(response.data.user.uuid));
                console.log("token" + JSON.stringify(response.data.token));
                console.log("Login Succesfull!");

                navigation.navigate('HomeScreen' as never);
              }
            })
            .catch((error) => {
              console.error("error: " + error);
              console.log("error.response: " + error.response);
              switch (error.response.status) {
                case 403:
                  // Poner aquí el alert ...
                  console.log("Incorrect Password");

                  break;
                case 404:
                  // Poner aquí el alert ...
                  console.log("User does not exist");
                  navigation.navigate("Register" as never);
                  break;
              }
            });
        }}
      />
      <NormalText>Aren't you still an @lplan member?</NormalText>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register" as never)}
      >
        <Register>Sign Up!</Register>
      </TouchableOpacity>
      <StatusBar />
    </MainContainer>
  );
}

*/