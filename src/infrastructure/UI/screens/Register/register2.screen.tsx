import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View, Text, Button, TouchableOpacity } from "react-native";
import MainContainer from "../../components/containers/Main";
import React from "react";
import SubTitle from "../../components/texts/Subtitle";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/ButtonGradientNext";
import ButtonGradientBack from "../../components/buttons/ButtonGradientBack";
import { StyleSheet } from "react-native";
import ButtonGradientShowPassword from "../../components/buttons/ButtonGradientShowPassword";

interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
}

export default function ScreenRegisterB() {
  const route = useRoute();
  const { appUser, nameUser, surnameUser }: RouteParams = route.params || {};
  const [mailUser, setMail] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigation = useNavigation();

  const handleGoToScreenRegisterC = () => {
    if (!mailUser || !passwordUser || !confirmation) {
      Alert.alert("Hello", "You must complete all the fields");
    } else if (passwordUser !== confirmation) {
      Alert.alert("Password", "Passwords do not match");
    } else if (!isValidEmail(mailUser)) {
      Alert.alert("Email", "Please enter a valid email address");
    } else if (passwordStrength === "weak") {
      Alert.alert("Password", "Your password is weak. Please choose a stronger password");
    } else {
      console.log(appUser);
      console.log(nameUser);
      console.log(surnameUser);
      console.log(mailUser);
      console.log(passwordUser);

      navigation.navigate("ScreenRegisterC" as never, {
        appUser,
        nameUser,
        surnameUser,
        mailUser,
        passwordUser,
      } as never);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePasswordChange = (value: string) => {
    setPasswordUser(value);

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChars = /[~¡@#$%^*()_\-+={}\[\]|:;",.¿]/.test(value);
    const hasMinimumLength = value.length >= 8;

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChars && hasMinimumLength) {
      setPasswordStrength("strong");
    } else if (
      (hasUpperCase && hasLowerCase && hasNumber && hasMinimumLength) ||
      (hasUpperCase && hasLowerCase && hasSpecialChars && hasMinimumLength) ||
      (hasUpperCase && hasNumber && hasSpecialChars && hasMinimumLength) ||
      (hasLowerCase && hasNumber && hasSpecialChars && hasMinimumLength)
    ) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <MainContainer>
      <Text style={styles.requiredText}>Fields with * are mandatory</Text>
      <SubTitle>Introduce your credentials</SubTitle>
      <View>
        <StyledTextInputs
          style={styles.textInput}
          placeholder="*Email"
          value={mailUser}
          onChangeText={(value: React.SetStateAction<string>) => setMail(value)}
        />
        <StyledTextInputs
          style={styles.textInput}
          placeholder="*Password"
          value={passwordUser}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
        />
        <View style={styles.passwordStrengthContainer}>
          <View
            style={[
              styles.passwordStrengthBar,
              { backgroundColor: getPasswordStrengthColor(passwordStrength) },
            ]}
          />
          
        </View>
        <StyledTextInputs
          style={styles.textInput}
          placeholder="*Confirmation"
          value={confirmation}
          onChangeText={(value: React.SetStateAction<string>) => setConfirmation(value)}
          secureTextEntry={!showPassword}
        />
        <View style={styles.showPasswordButton}>
  <TouchableOpacity onPress={toggleShowPassword}>
    <Text style={styles.showPasswordButtonText}>
      {showPassword ? "Hide Password" : "Show Password"}
    </Text>
  </TouchableOpacity>
</View>

      </View>
      <View style={styles.buttonContainer}>
        <ButtonGradientNext onPress={handleGoToScreenRegisterC} />
        <ButtonGradientBack onPress={handleGoBack} />
      </View>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  requiredText: {
    color: "red",
    marginTop: 10,
    fontStyle: "italic",
  },
  passwordStrengthContainer: {
    height: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
    marginTop: 10,
  },
  passwordStrengthBar: {
    height: 10,
    borderRadius: 5,
  },
  textInput: {
    width: 250,
  },
  showPasswordButton: {
    alignSelf: "center",
    marginTop: 5,
    color:"red"
  
  },
  showPasswordButtonText: {
    color: "white",
    marginTop: 10,
    fontStyle: "italic",
  },
});


function getPasswordStrengthColor(strength: string) {
  switch (strength) {
    case "strong":
      return "red";
    case "medium":
      return "yellow";
    case "weak":
      return "green";
    default:
      return "#EEE";
  }
}
