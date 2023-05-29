import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, Platform, StyleSheet, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SessionService } from "../../../services/user/session.service";
import { UserAuthEntity } from "../../../../domain/user/user.entity";
import * as Font from 'expo-font';
import MainContainer from "../../components/containers/Main";

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
  descriptionUser?: string;
  roleUser?: string;
  privacyUser?: string;
}

export default function ScreenRegisterFinal({
  navigation,
}: {
  navigation: any;
}) {
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
    descriptionUser,
    roleUser,
    privacyUser,
  }: RouteParams = route.params || {};

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

  const handleRegister = async () => {
    try {
      const user: UserAuthEntity = {
        uuid: "a" ?? "",
        appUser: appUser ?? "",
        nameUser: nameUser ?? "",
        surnameUser: surnameUser ?? "",
        mailUser: mailUser ?? "",
        passwordUser: passwordUser ?? "",
        photoUser: photoUser ?? "",
        birthdateUser: new Date(birthdateUser ?? ""),
        genderUser:
          genderUser === "male" || genderUser === "female"
            ? genderUser
            : "male",
        ocupationUser: ocupationUser ?? "",
        descriptionUser: descriptionUser ?? "",
        roleUser:
          roleUser === "admin" ||
          roleUser === "common" ||
          roleUser === "verified" ||
          roleUser === "business"
            ? roleUser
            : "common",
        privacyUser: privacyUser === "private" ? true : false,
        deletedUser: false,
      };

      SessionService.register(user).then((response)=>{
        console.log(response);
        if(response.status===200){
          console.log(JSON.stringify(response.data));
        };
      }).catch((error)=>{
        console.log("error: "+error);
      })
      //console.log("Registration successful:", response.data);

      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const styles = StyleSheet.create({
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
        <Text>{appUser}</Text>
        <Text>{nameUser}</Text>
        <Text>{surnameUser}</Text>
        <Text>{mailUser}</Text>
        <Text>{passwordUser}</Text>
        <Text>{photoUser}</Text>
        <Text>{birthdateUser}</Text>
        <Text>{genderUser}</Text>
        <Text>{ocupationUser}</Text>
        <Text>{descriptionUser}</Text>
        <Text>{roleUser}</Text>
        <Text>{privacyUser}</Text>
        <Button title="Register" onPress={handleRegister}/>
      </MainContainer>
    </ImageBackground>
  );
}
