import React, { useState } from "react";
import { Button, TextInput, Text, Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MainContainer from "../../components/containers/Main";
import SubTitle from "../../components/texts/Subtitle";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import { StyleSheet } from "react-native";

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
    navigation.navigate("LoginScreen" as never);
  };

  return (
    
    <MainContainer>
      <Text style={styles.requiredText}>Fields with * are mandatory</Text>
      <SubTitle>Sign up to have a new account</SubTitle>
      <StyledTextInputs
        placeholder="*Nickname"
        value={appUser}
        onChangeText={(value: React.SetStateAction<string>) =>
          setAppUser(value)
        }
        //keyboardType="numeric"
      />
      <StyledTextInputs
        placeholder="*Name"
        value={nameUser}
        onChangeText={(value: React.SetStateAction<string>) =>
          setNameUser(value)
        }
      />
      <StyledTextInputs
        placeholder="*Surname"
        value={surnameUser}
        onChangeText={(value: React.SetStateAction<string>) =>
          setSurnameUser(value)
        }
      />
      <View style={styles.buttonContainer}>
        <ButtonGradientNext onPress={handleGoToScreenRegisterB} />
        <ButtonGradientBack onPress={handleGoBack} />
      </View>
      

    </MainContainer>
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  requiredText: {
    color: 'red',
    marginTop: 10,
    fontStyle:'italic'
  },
});
