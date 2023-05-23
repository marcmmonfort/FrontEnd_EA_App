import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SessionService } from "../../../services/user/session.service";
import { UserAuthEntity } from "../../../../domain/user/user.entity";
import Register from "../../components/texts/Register";
import ButtonGradient from "../../components/buttons/ButtonGradient";

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
  const handleRegister = async () => {
    try {
      const user: UserAuthEntity = {
        uuid: "",
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
      console.log(user);

      // Llamar al servicio de registro
      const response = await SessionService.register(user);
      console.log("Registration successful:", response.data);

      // Redirigir a la pantalla de inicio de sesión u otra pantalla deseada
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error during registration:", error);
      // Manejar el error de registro aquí
    }
  };

  return (
    <>
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
      <Button title="Register" onPress={handleRegister} />
    </>
  );
}
