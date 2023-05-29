import React, { useEffect, useState } from "react";
import { Button, TextInput, Text, Alert, View, Platform, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MainContainer from "../../components/containers/Main";
import SubTitle from "../../components/texts/Subtitle";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import { StyleSheet } from "react-native";
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../../assets/fonts/SFNS.otf'),
  });
}

export default function ScreenRegisterA() {
  const [appUser, setAppUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [surnameUser, setSurnameUser] = useState("");
  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const titleFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });

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
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
    },
  });

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_6.png')} style={styles.backgroundImage}>
      <MainContainer style={styles.mainContainer}>
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
    </ImageBackground>

  );
}

