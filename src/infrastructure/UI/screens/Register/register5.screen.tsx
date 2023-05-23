import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View, Text, Button } from "react-native";
import MainContainer from "../../components/containers/Main";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";

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

  const [descriptionUser, setdescriptionUser] = useState("");
  const [roleUser, setroleUser] = useState("");
  const [privacyUser, setprivacyUser] = useState<boolean>(false);

  const navigation = useNavigation();

  const convertPrivacyToBoolean = (privacy: string) => {
    if (privacy == "Private") {
      return true;
    } else if (privacy == "Public") {
      return false;
    }
    return false;
  };

  const handleGoToScreenRegisterF = () => {
    if (!descriptionUser || !roleUser || privacyUser === undefined) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      navigation.navigate("ScreenRegisterFinal", {
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
        privacyUser: privacyUser.toString(),
      });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    text: {
      color: "white",
    },
    picker: {
      color: "black",
      width: 250,
      backgroundColor: "yellow",
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
    },
  });

  return (
    <MainContainer>
      <View>
        <StyledTextInputs
          placeholder="Description"
          value={descriptionUser}
          onChangeText={(value: React.SetStateAction<string>) =>
            setdescriptionUser(value)
          }
        />
        <Picker
          selectedValue={roleUser}
          style={styles.picker}
          onValueChange={(itemValue) => setroleUser(itemValue)}
        >
          <Picker.Item label="Common" value="common" />
          <Picker.Item label="Business" value="Business" />
        </Picker>
        <Picker
          selectedValue={privacyUser.toString()}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setprivacyUser(convertPrivacyToBoolean(itemValue))
          }
        >
          <Picker.Item label="Private" value="Private" />
          <Picker.Item label="Public" value="Public" />
        </Picker>
      </View>
      <Text style={styles.text}>{descriptionUser}</Text>
      <Text style={styles.text}>{roleUser}</Text>
      <Text style={styles.text}>{privacyUser.toString()}</Text>

      <Button title="Next" onPress={handleGoToScreenRegisterF} />
      <Button title="Back" onPress={handleGoBack} />
    </MainContainer>
  );
}
