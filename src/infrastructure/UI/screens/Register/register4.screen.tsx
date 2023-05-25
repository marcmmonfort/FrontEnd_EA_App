import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, View, Text, Button } from "react-native";
import MainContainer from "../../components/containers/Main";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";

interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
  photoUser?: string;
}

export default function ScreenRegisterD() {
  const route = useRoute();
  const {
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
    photoUser,
  }: RouteParams = route.params || {};
  const [birthdateUser, setbirthdateUser] = useState("");
  const [genderUser, setgenderUser] = useState("");
  const [ocupationUser, setocupationUser] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setbirthdateUser(selectedDate.toISOString());
    }
  };

  const formatDate = (date: {
    getDate: () => any;
    getMonth: () => number;
    getFullYear: () => any;
  }) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year}`;
  };

  const navigation = useNavigation();

  const handleGoToScreenRegisterE = () => {
    if (!birthdateUser || !genderUser) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      navigation.navigate("ScreenRegisterE"as never, {
        appUser,
        nameUser,
        surnameUser,
        mailUser,
        passwordUser,
        photoUser,
        birthdateUser,
        genderUser,
        ocupationUser,
      }as never);
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
        <Button title="Select Birthdate" onPress={handleShowDatePicker} />
        <Text style={styles.text}>
          Selected Birthdate: {selectedDate.toDateString()}
        </Text>
        <Text style={styles.text}>
          Selected Birthdate: {formatDate(selectedDate)}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Picker
          selectedValue={genderUser}
          style={styles.picker}
          onValueChange={(itemValue) => setgenderUser(itemValue)}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
        <StyledTextInputs
          placeholder="Ocupation"
          value={ocupationUser}
          onChangeText={(value: React.SetStateAction<string>) =>
            setocupationUser(value)
          }
        />
      </View>
      <Text style={styles.text}>{birthdateUser}</Text>
      <Text style={styles.text}>{genderUser}</Text>
      <Text style={styles.text}>{ocupationUser}</Text>

      <Button title="Next" onPress={handleGoToScreenRegisterE} />
      <Button title="Back" onPress={handleGoBack} />
    </MainContainer>
  );
}
