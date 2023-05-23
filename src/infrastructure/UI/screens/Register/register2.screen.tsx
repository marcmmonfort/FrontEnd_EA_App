import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainContainer from "../../components/containers/Main";
import { Alert,Button,Text } from "react-native";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";

interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
}

export default function ScreenRegisterB() {
    const route = useRoute()
    const { appUser, nameUser, surnameUser}: RouteParams = route.params || {};
    const [mailUser, setMail] = useState("");
    const [passwordUser, setPasswordUser] = useState("");
    const [confirmation, setConfirmation] = useState("");

    const navigation = useNavigation();

    const handleGoToScreenRegisterC = () => {
        if (!mailUser || !passwordUser || !confirmation) {
          Alert.alert("Hello", "You must complete all the fields");
        } 
        else if(passwordUser!==confirmation){
            Alert.alert("Password", "Passwords does not match");
        }
        else if (!isValidEmail(mailUser)) {
            Alert.alert("Email", "Please enter a valid email address");
          }
        else {
          navigation.navigate("ScreenRegisterC", {
            appUser,
            nameUser,
            surnameUser,
            mailUser,
            passwordUser,
          });
        }
      };
    
      const handleGoBack = () => {
        navigation.goBack();
      };
      const isValidEmail = (email:string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
      return (
        <MainContainer>
            <StyledTextInputs
        placeholder="Email"
        value={mailUser}
        onChangeText={(value: React.SetStateAction<string>) =>
            setMail(value)
          }
      />
      <StyledTextInputs
        placeholder="Password"
        value={passwordUser}
        onChangeText={(value: React.SetStateAction<string>) =>
            setPasswordUser(value)
          }
        secureTextEntry={true}
      />
      <StyledTextInputs
        placeholder="Confirmation"
        value={confirmation}
        onChangeText={(value: React.SetStateAction<string>) =>
            setConfirmation(value)
          }
        secureTextEntry={true}
      />
      <Button title="Next" onPress={handleGoToScreenRegisterC} />
      <Button title="Back" onPress={handleGoBack} />
        </MainContainer>
      )
        
}