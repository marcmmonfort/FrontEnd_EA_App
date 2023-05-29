import React, { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet, Platform, ImageBackground } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import MainContainer from "../../components/containers/Main";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../../assets/fonts/SFNS.otf'),
  });
}

interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
  photoUser?: string;
  birthdateUser?: string;
  genderUser?: string;
  ocupationUser?: string;
}

export default function ScreenRegisterE() {
  const route = useRoute();
  const {
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
    photoUser,
    birthdateUser,
    genderUser,
    ocupationUser,
  }: RouteParams = route.params || {};

  const [descriptionUser, setDescriptionUser] = useState("");
  const [roleUser, setRoleUser] = useState("common");
  const [privacyUser, setPrivacyUser] = useState<boolean>(false);

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

  const handleGoToScreenRegisterF = () => {
    if (!descriptionUser) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      const selectedRole=roleUser || "common";
      const selectedPrivact=privacyUser || false;
      console.log(appUser);
      console.log(nameUser);
      console.log(surnameUser);
      console.log(mailUser);
      console.log(passwordUser);
      console.log(photoUser);
      console.log(birthdateUser);
      console.log(genderUser);
      console.log(ocupationUser);
      console.log(descriptionUser);
      console.log(roleUser);
      console.log(privacyUser);
      navigation.navigate("ScreenRegisterFinal" as never, {
        appUser,
        nameUser,
        surnameUser,
        mailUser,
        passwordUser,
        photoUser,
        birthdateUser,
        genderUser,
        ocupationUser,
        descriptionUser,
        roleUser:selectedRole,
        privacyUser:selectedPrivact,
      }as never);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    text: {
      color: "white",
      fontStyle: "italic",
      marginBottom: 20,
      marginTop: 20,
      alignContent: "center",
    },
    picker: {
      color: "black",
      fontWeight: "bold",
      backgroundColor: "#66fcf1",
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    textInput: {
      width: 250,
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
        <View>
          <StyledTextInputs
            style={styles.textInput}
            placeholder="Description"
            value={descriptionUser}
            onChangeText={setDescriptionUser}
          />
          <Picker
            selectedValue={roleUser}
            style={styles.picker}
            onValueChange={setRoleUser}
          >
            <Picker.Item label="Common" value="common" />
            <Picker.Item label="Business" value="Business" />
          </Picker>
          <Picker
            selectedValue={privacyUser ? "Private" : "Public"}
            style={styles.picker}
            onValueChange={(itemValue) => {
              if(itemValue==="Private"){
                setPrivacyUser(true);
              }
              else{
                setPrivacyUser(false)}
              }
              }
          >
            <Picker.Item label="Private" value="Private" />
            <Picker.Item label="Public" value="Public" />
          </Picker>
        </View>
        <Text style={styles.text}>{descriptionUser}</Text>
        <Text style={styles.text}>{roleUser}</Text>
        <Text style={styles.text}>{privacyUser.toString()}</Text>
        <View style={styles.buttonContainer}>
          <ButtonGradientNext onPress={handleGoToScreenRegisterF} />
          <ButtonGradientBack onPress={handleGoBack} />
        </View>
      </MainContainer>
    </ImageBackground>
  );
}
