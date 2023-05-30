import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, View, Text, Button, Platform, ImageBackground } from "react-native";
import MainContainer from "../../components/containers/Main";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import ButtonGradientNext from "../../components/buttons/Button_Type_Next";
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import ButtonGradientBirthdate from "../../components/buttons/Button_Type_Birthdate";
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
    if (!birthdateUser) {
      Alert.alert("Warning", "You must select a Birthdate!");
    } else {
      const selectedGender = genderUser || "male"; // Si no se selecciona ningún valor, se asigna "male" por defecto
      if (isDateValid(selectedDate)) {
        console.log(appUser);
        console.log(nameUser);
        console.log(surnameUser);
        console.log(mailUser);
        console.log(passwordUser);
        console.log(photoUser);
        console.log(birthdateUser);
        console.log(selectedGender);
        console.log(ocupationUser);
        
        navigation.navigate("ScreenRegisterE" as never, {
          appUser,
          nameUser,
          surnameUser,
          mailUser,
          passwordUser,
          photoUser,
          birthdateUser,
          genderUser: selectedGender,
          ocupationUser,
        } as never);
      } else {
        Alert.alert("Invalid Date", "App +16");
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isDateValid = (date: Date) => {
    const currentDate = new Date();
    const sixteenYearsAgo = new Date(
      currentDate.getFullYear() - 16,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    return date <= sixteenYearsAgo;
  };

  const styles = StyleSheet.create({
    text: {
      color: "white",
      fontStyle:'italic',
      marginBottom:20,
      marginTop:20,
      alignContent:"center",
    },
    picker: {
      color: "black",
      fontWeight:'bold',
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
    buttonContainerB: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    requiredText: {
      color: 'yellow',
      marginTop: 10,
      fontFamily: bodyFont,
    },
    textInput: {
      width: 250,
    },
    date:{
      justifyContent:"center"
    },
    requiredTextB: {
      color: "red",
      marginTop: 10,
      marginBottom:-25,
      fontStyle: "italic",
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    mainContainer: {
      backgroundColor: 'transparent',
    },
    nextBackButton: {
      margin: 6,
      padding: 6,
      backgroundColor: "#66fcf1",
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 96,
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
      marginTop: 0,
      alignItems: 'center',
    },
    input: {
      width: 300,
      height: 40,
    },
    registerTitle: {
      textAlign: 'center',
      fontFamily: titleFont,
      paddingTop: 4,
      fontSize: 34,
      color: '#ffffff',
      height: 40,
    },
    stepTitle: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 18,
      color: '#ffffff',
    },
  });

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_6.png')} style={styles.backgroundImage}>
      <MainContainer style={styles.mainContainer}>
        <View>
          <View style={styles.buttonContainerB}>
            <ButtonGradientBirthdate onPress={handleShowDatePicker} />
          </View>
          <Text style={styles.text}>Selected Birthdate: {formatDate(selectedDate)}</Text>
          {showDatePicker && (
            <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange}/>
          )}
          <Picker selectedValue={genderUser} style={styles.picker} onValueChange={(itemValue) => setgenderUser(itemValue)}>
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
          <StyledTextInputs style={styles.textInput} placeholder="Ocupation" value={ocupationUser} onChangeText={(value: React.SetStateAction<string>) => setocupationUser(value) }/>
        </View>
        <Text style={styles.requiredText}>* Mandatory Fields</Text>
        <View style={styles.buttonContainer}>
          <ButtonGradientNext  onPress={handleGoToScreenRegisterE} />
          <ButtonGradientBack onPress={handleGoBack} />
        </View>
      </MainContainer>
    </ImageBackground>
  );
}

