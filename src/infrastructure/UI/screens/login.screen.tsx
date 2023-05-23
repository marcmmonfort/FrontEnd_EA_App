import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import Svg, { Defs, Path, Pattern, Use, Image } from "react-native-svg";
import MainContainer from "../components/containers/Main";
import Title from "../components/texts/Title";
import SubTitle from "../components/texts/Subtitle";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import ButtonGradient from "../components/buttons/ButtonGradient";
import { AuthEntity } from "../../../domain/user/user.entity";
import { SessionService } from "../../services/user/session.service";
import NormalText from "../components/texts/NormalText";
import { StatusBar, TouchableOpacity } from "react-native";
import Register from "../components/texts/Register";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  return (
    <MainContainer>
      <Title>Lplan</Title>
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
                console.log("YA NO ESTOY CHINADO");
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
