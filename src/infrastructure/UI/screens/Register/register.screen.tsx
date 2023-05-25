import React, { useState } from "react";
import { Button, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MainContainer from "../../components/containers/Main";
import SubTitle from "../../components/texts/Subtitle";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";

export default function ScreenRegisterA() {
  const [appUser, setAppUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [surnameUser, setSurnameUser] = useState("");
  const navigation = useNavigation();

  const handleGoToScreenRegisterB = () => {
    if (!appUser || !nameUser || !surnameUser) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      navigation.navigate("ScreenRegisterB" as never, {
        appUser,
        nameUser,
        surnameUser,
        
      }as never);
    }
  };

  const handleGoBack = () => {
    navigation.navigate("Login" as never);
  };

  return (
    <MainContainer>
      <SubTitle>Sign up to have a new account</SubTitle>
      <StyledTextInputs
        placeholder="Nickname"
        value={appUser}
        onChangeText={(value: React.SetStateAction<string>) =>
          setAppUser(value)
        }
        //keyboardType="numeric"
      />
      <StyledTextInputs
        placeholder="Name"
        value={nameUser}
        onChangeText={(value: React.SetStateAction<string>) =>
          setNameUser(value)
        }
      />
      <StyledTextInputs
        placeholder="Surname"
        value={surnameUser}
        onChangeText={(value: React.SetStateAction<string>) =>
          setSurnameUser(value)
        }
      />
      <Button title="Next" onPress={handleGoToScreenRegisterB} />
      <Button title="Back" onPress={handleGoBack} />
    </MainContainer>
  );
}
